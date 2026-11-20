create function private.ministry_leader_names()
returns table (ministry_id uuid, full_name text)
language sql stable security definer set search_path = ''
as $$
  select membership.ministry_id, profile.full_name
  from public.ministry_members as membership
  join public.ministries as ministry on ministry.id = membership.ministry_id
  join public.profiles as profile on profile.id = membership.user_id
  where (select auth.uid()) is not null
    and ministry.active is true
    and membership.status = 'approved'
    and membership.role = 'leader'
  order by profile.full_name;
$$;

revoke execute on function private.ministry_leader_names() from public, anon;
grant execute on function private.ministry_leader_names() to authenticated;

create function public.ministry_leader_names()
returns table (ministry_id uuid, full_name text)
language sql stable security invoker set search_path = ''
as $$
  select * from private.ministry_leader_names();
$$;

revoke execute on function public.ministry_leader_names() from public, anon;
grant execute on function public.ministry_leader_names() to authenticated;
