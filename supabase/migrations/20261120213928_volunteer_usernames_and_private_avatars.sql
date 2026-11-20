alter table public.profiles add column username text
  check (username is null or username ~ '^[a-z0-9_]{3,24}$');
create unique index profiles_username_key on public.profiles (username) where username is not null;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  requested_username text := lower(btrim(new.raw_user_meta_data->>'username'));
begin
  insert into public.profiles (id, full_name, email, role, username)
  values (
    new.id, coalesce(nullif(btrim(new.raw_user_meta_data->>'full_name'), ''), 'Voluntário'),
    new.email, 'volunteer',
    case when requested_username ~ '^[a-z0-9_]{3,24}$' then requested_username end
  );
  return new;
end;
$$;

create or replace function private.protect_profile_role()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if current_user in ('anon', 'authenticated')
    and (new.role is distinct from old.role or new.username is distinct from old.username) then
    raise exception 'O cargo e o nome de usuário são protegidos.' using errcode = '42501';
  end if;
  return new;
end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('volunteer-avatars', 'volunteer-avatars', false, 1572864, array['image/jpeg','image/png','image/webp']);

create policy avatar_owner_read on storage.objects for select to authenticated
  using (bucket_id = 'volunteer-avatars' and name = (select auth.uid())::text || '/profile');
create policy avatar_owner_write on storage.objects for insert to authenticated
  with check (bucket_id = 'volunteer-avatars' and name = (select auth.uid())::text || '/profile');
create policy avatar_owner_replace on storage.objects for update to authenticated
  using (bucket_id = 'volunteer-avatars' and name = (select auth.uid())::text || '/profile')
  with check (bucket_id = 'volunteer-avatars' and name = (select auth.uid())::text || '/profile');
