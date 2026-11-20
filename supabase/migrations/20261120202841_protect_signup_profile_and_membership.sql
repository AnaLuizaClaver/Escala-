create schema if not exists private;

create or replace function private.is_escalae_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;
revoke execute on function private.is_escalae_admin() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_escalae_admin() to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, coalesce(nullif(btrim(new.raw_user_meta_data->>'full_name'), ''), 'Voluntário'), new.email, 'volunteer');
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create or replace function private.protect_profile_role()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if current_user in ('anon', 'authenticated') and new.role is distinct from old.role then
    raise exception 'A alteração de cargo exige administração do banco.' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger protect_profile_role before update on public.profiles
  for each row execute function private.protect_profile_role();

alter policy "Perfis visíveis para autenticados" on public.profiles
  to authenticated using (id = (select auth.uid()) or (select private.is_escalae_admin()));

alter policy "Membros de ministérios visíveis para autenticados" on public.ministry_members
  to authenticated using (user_id = (select auth.uid()) or (select private.is_escalae_admin()));
alter policy "Usuário solicita entrada no ministério" on public.ministry_members
  to authenticated with check (
    user_id = (select auth.uid()) and role = 'volunteer' and status = 'pending'
    and exists (select 1 from public.ministries where id = ministry_id and active is true)
  );
alter policy "Líderes e admins gerenciam membros" on public.ministry_members
  to authenticated using ((select private.is_escalae_admin()))
  with check ((select private.is_escalae_admin()));
