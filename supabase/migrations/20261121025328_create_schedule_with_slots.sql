create function public.create_schedule_with_slots(
  p_schedule jsonb,
  p_slots jsonb,
  p_song_ids uuid[]
) returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  input public.schedules := jsonb_populate_record(null::public.schedules, p_schedule);
  saved public.schedules;
begin
  if not exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  ) then
    raise exception 'Somente administradores podem cadastrar escalas.' using errcode = '42501';
  end if;

  if input.status is null or input.status not in ('draft', 'published') then
    raise exception 'Selecione um status válido para a escala.' using errcode = '22023';
  end if;

  insert into public.schedules (id, ministry_id, title, date, start_time, end_time, location, status)
  values (input.id, input.ministry_id, input.title, input.date, input.start_time, input.end_time, input.location, input.status)
  on conflict (id) do nothing
  returning * into saved;

  if found then
    if exists (
      select 1 from jsonb_to_recordset(p_slots) as slot(role_id uuid, ministry_member_id uuid)
      left join public.ministry_roles as role on role.id = slot.role_id
      left join public.ministry_members as member on member.id = slot.ministry_member_id
      where (slot.role_id is not null and role.ministry_id is distinct from saved.ministry_id)
         or (slot.ministry_member_id is not null and (
           member.ministry_id is distinct from saved.ministry_id or member.status is distinct from 'approved'
         ))
    ) then
      raise exception 'Selecione funções e voluntários aprovados do ministério da escala.' using errcode = '22023';
    end if;

    insert into public.schedule_members (schedule_id, role_id, ministry_member_id, response)
    select saved.id, slot.role_id, slot.ministry_member_id, 'pending'
      from jsonb_to_recordset(p_slots) as slot(role_id uuid, ministry_member_id uuid);

    insert into public.schedule_songs (schedule_id, song_id, position)
    select saved.id, song.id, song.position::integer
      from unnest(p_song_ids) with ordinality as song(id, position);
  else
    select * into strict saved from public.schedules where id = input.id;
  end if;

  return jsonb_build_object(
    'schedule', to_jsonb(saved),
    'slots', coalesce((select jsonb_agg(slot) from public.schedule_members as slot where slot.schedule_id = saved.id), '[]'::jsonb),
    'songs', coalesce((select jsonb_agg(song order by song.position) from public.schedule_songs as song where song.schedule_id = saved.id), '[]'::jsonb)
  );
end;
$$;

revoke execute on function public.create_schedule_with_slots(jsonb, jsonb, uuid[]) from public, anon;
grant execute on function public.create_schedule_with_slots(jsonb, jsonb, uuid[]) to authenticated;
