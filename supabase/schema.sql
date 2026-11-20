-- ==============================================================================
-- ESCALAÊ - ESQUEMA DE BANCO DE DADOS (SUPABASE / POSTGRESQL)
-- ==============================================================================

-- 1. Habilitar extensão de UUID
create extension if not exists "uuid-ossp";

-- 2. Tabela: PROFILES (Perfis de Usuários)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  email text,
  phone text,
  birth_date date,
  role text default 'volunteer' check (role in ('volunteer', 'leader', 'admin')),
  avatar_url text,
  availability jsonb default '{"Dom": [], "Seg": [], "Ter": [], "Qua": [], "Qui": [], "Sex": [], "Sáb": []}'::jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. Tabela: MINISTRIES (Ministérios da Igreja)
create table if not exists public.ministries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  icon text default '🎵',
  color text default '#C6FF4D',
  active boolean default true,
  auto_schedule_enabled boolean default false,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 4. Tabela: MINISTRY_ROLES (Funções dentro de cada ministério, ex: Vocal, Bateria, Câmera)
create table if not exists public.ministry_roles (
  id uuid default gen_random_uuid() primary key,
  ministry_id uuid references public.ministries(id) on delete cascade not null,
  name text not null,
  max_volunteers integer default 1,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 5. Tabela: MINISTRY_MEMBERS (Vínculos de Voluntários com Ministérios)
create table if not exists public.ministry_members (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  ministry_id uuid references public.ministries(id) on delete cascade not null,
  role text default 'volunteer' check (role in ('volunteer', 'leader')),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  unique (user_id, ministry_id)
);

-- 6. Tabela: SCHEDULES (Escalas / Cultos / Eventos)
create table if not exists public.schedules (
  id uuid default gen_random_uuid() primary key,
  ministry_id uuid references public.ministries(id) on delete cascade not null,
  title text not null,
  description text,
  date date not null,
  start_time time not null,
  end_time time,
  location text default 'Templo Principal',
  status text default 'published' check (status in ('draft', 'published', 'canceled')),
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 7. Tabela: SCHEDULE_MEMBERS (Vagas e Voluntários escalados)
create table if not exists public.schedule_members (
  id uuid default gen_random_uuid() primary key,
  schedule_id uuid references public.schedules(id) on delete cascade not null,
  role_id uuid references public.ministry_roles(id) on delete set null,
  ministry_member_id uuid references public.ministry_members(id) on delete set null,
  response text default 'pending' check (response in ('pending', 'confirmed', 'declined')),
  decline_reason text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 8. Tabela: SONGS (Repertório musical)
create table if not exists public.songs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  artist text not null,
  bpm integer,
  musical_key text,
  notes text,
  cifra_url text,
  youtube_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 9. Tabela: SCHEDULE_SONGS (Músicas da Escala)
create table if not exists public.schedule_songs (
  id uuid default gen_random_uuid() primary key,
  schedule_id uuid references public.schedules(id) on delete cascade not null,
  song_id uuid references public.songs(id) on delete cascade not null,
  position integer default 1,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 10. Tabela: SCHEDULE_SWAP_REQUESTS (Solicitações de Troca)
create table if not exists public.schedule_swap_requests (
  id uuid default gen_random_uuid() primary key,
  schedule_member_id uuid references public.schedule_members(id) on delete cascade not null,
  requester_id uuid references public.ministry_members(id) on delete cascade not null,
  target_member_id uuid references public.ministry_members(id) on delete set null,
  reason text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'canceled')),
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 11. Tabela: FEED_POSTS (Comunicação / Mural da Igreja)
create table if not exists public.feed_posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  ministry_id uuid references public.ministries(id) on delete set null,
  type text default '📢 Aviso',
  title text not null,
  content text not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 12. Tabela: FEED_COMMENTS (Comentários nos posts)
create table if not exists public.feed_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.feed_posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 13. Tabela: FEED_LIKES (Curtidas nos posts)
create table if not exists public.feed_likes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.feed_posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  unique (post_id, user_id)
);

-- 14. Tabela: VOLUNTEER_OF_MONTH (Destaque do Mês)
create table if not exists public.volunteer_of_month (
  id uuid default gen_random_uuid() primary key,
  volunteer_id uuid references public.profiles(id) on delete cascade not null,
  ministry_id uuid references public.ministries(id) on delete set null,
  month integer not null check (month between 1 and 12),
  year integer not null,
  reason text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- TRIGGER PARA CRIAR PERFIL AUTOMÁTICO AO CADASTRAR NO SUPABASE AUTH
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, phone, birth_date, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Voluntário'),
    new.email,
    new.raw_user_meta_data->>'phone',
    case when new.raw_user_meta_data->>'birth_date' is not null and new.raw_user_meta_data->>'birth_date' <> ''
         then (new.raw_user_meta_data->>'birth_date')::date
         else null end,
    coalesce(new.raw_user_meta_data->>'role', 'volunteer')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Remove o trigger se já existir e recria
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.ministries enable row level security;
alter table public.ministry_roles enable row level security;
alter table public.ministry_members enable row level security;
alter table public.schedules enable row level security;
alter table public.schedule_members enable row level security;
alter table public.songs enable row level security;
alter table public.schedule_songs enable row level security;
alter table public.schedule_swap_requests enable row level security;
alter table public.feed_posts enable row level security;
alter table public.feed_comments enable row level security;
alter table public.feed_likes enable row level security;
alter table public.volunteer_of_month enable row level security;

-- ==============================================================================
-- POLÍTICAS DE ACESSO (POLICIES)
-- ==============================================================================

-- Profiles: Qualquer autenticado pode ver perfis; cada um edita o seu; admins editam todos
create policy "Perfis visíveis para autenticados" on public.profiles
  for select using (auth.role() = 'authenticated');

create policy "Usuário atualiza próprio perfil" on public.profiles
  for update using (auth.uid() = id);

-- Ministries & Roles: Todos autenticados leem; admins e líderes criam/editam
create policy "Ministérios visíveis para todos autenticados" on public.ministries
  for select using (auth.role() = 'authenticated');

create policy "Admins gerenciam ministérios" on public.ministries
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'leader'))
  );

create policy "Funções visíveis para todos autenticados" on public.ministry_roles
  for select using (auth.role() = 'authenticated');

create policy "Admins gerenciam funções" on public.ministry_roles
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'leader'))
  );

-- Ministry Members:
create policy "Membros de ministérios visíveis para autenticados" on public.ministry_members
  for select using (auth.role() = 'authenticated');

create policy "Usuário solicita entrada no ministério" on public.ministry_members
  for insert with check (auth.uid() = user_id);

create policy "Líderes e admins gerenciam membros" on public.ministry_members
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'leader'))
  );

-- Schedules & Schedule Members:
create policy "Escalas visíveis para autenticados" on public.schedules
  for select using (auth.role() = 'authenticated');

create policy "Líderes gerenciam escalas" on public.schedules
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'leader'))
  );

create policy "Vagas de escalas visíveis para autenticados" on public.schedule_members
  for select using (auth.role() = 'authenticated');

create policy "Voluntário responde ou solicita sua vaga" on public.schedule_members
  for update using (
    exists (
      select 1 from public.ministry_members mm
      where mm.id = schedule_members.ministry_member_id
      and mm.user_id = auth.uid()
    )
    or exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'leader'))
  );

create policy "Líderes gerenciam vagas das escalas" on public.schedule_members
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'leader'))
  );

-- Songs:
create policy "Músicas visíveis para autenticados" on public.songs
  for select using (auth.role() = 'authenticated');

create policy "Músicas gerenciáveis por líderes" on public.songs
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'leader'))
  );

create policy "Músicas da escala visíveis para autenticados" on public.schedule_songs
  for select using (auth.role() = 'authenticated');

create policy "Líderes gerenciam repertório da escala" on public.schedule_songs
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'leader'))
  );

-- Swap Requests:
create policy "Trocas visíveis para autenticados" on public.schedule_swap_requests
  for select using (auth.role() = 'authenticated');

create policy "Voluntário solicita troca" on public.schedule_swap_requests
  for insert with check (
    exists (
      select 1 from public.ministry_members mm
      where mm.id = schedule_swap_requests.requester_id
      and mm.user_id = auth.uid()
    )
  );

create policy "Líderes e envolvidos atualizam troca" on public.schedule_swap_requests
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'leader'))
    or exists (
      select 1 from public.ministry_members mm
      where (mm.id = schedule_swap_requests.requester_id or mm.id = schedule_swap_requests.target_member_id)
      and mm.user_id = auth.uid()
    )
  );

-- Feed:
create policy "Feed visível para todos autenticados" on public.feed_posts
  for select using (auth.role() = 'authenticated');

create policy "Líderes e admins criam posts" on public.feed_posts
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'leader'))
  );

create policy "Comentários visíveis para todos autenticados" on public.feed_comments
  for select using (auth.role() = 'authenticated');

create policy "Qualquer autenticado comenta" on public.feed_comments
  for insert with check (auth.uid() = author_id);

create policy "Likes visíveis para todos autenticados" on public.feed_likes
  for select using (auth.role() = 'authenticated');

create policy "Qualquer autenticado curte/descurte" on public.feed_likes
  for all using (auth.uid() = user_id);

-- Destaque do mês:
create policy "Destaque visível para autenticados" on public.volunteer_of_month
  for select using (auth.role() = 'authenticated');

create policy "Admins definem destaque do mês" on public.volunteer_of_month
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'leader'))
  );

-- ==============================================================================
-- DADOS INICIAIS (SEEDS)
-- ==============================================================================
insert into public.ministries (name, description, icon, color, active)
values
  ('Louvor & Adoração', 'Ministério de música, instrumentistas e vocais', '🎵', '#C6FF4D', true),
  ('Mídia & Transmissão', 'Câmeras, projeção, som e transmissão ao vivo', '📷', '#60a5fa', true),
  ('Recepção & Boas-Vindas', 'Acolhimento de membros e visitantes no templo', '🤝', '#f472b6', true),
  ('Ministério Infantil', 'Ensino e cuidado com as crianças durante os cultos', '👶', '#fbbf24', true)
on conflict do nothing;
