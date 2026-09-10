-- INTERAULAS: esquema Supabase
create extension if not exists pgcrypto;

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  day integer not null,
  gender text not null check (gender in ('M','F')),
  group_name text,
  home_team text not null,
  away_team text not null,
  home_score integer,
  away_score integer,
  created_at timestamptz default now()
);

create table if not exists public.sanctions (
  id uuid primary key default gen_random_uuid(),
  team text not null,
  player text,
  type text not null,
  description text,
  created_at timestamptz default now()
);

alter table public.matches enable row level security;
alter table public.sanctions enable row level security;

-- Público: cualquiera puede ver tablas, partidos y sanciones.
create policy "public read matches" on public.matches for select using (true);
create policy "public read sanctions" on public.sanctions for select using (true);

-- Para editar, primero crea usuarios en Authentication > Users.
-- Esta versión permite que cualquier usuario autenticado edite.
create policy "authenticated update matches" on public.matches for update to authenticated using (true) with check (true);
create policy "authenticated insert sanctions" on public.sanctions for insert to authenticated with check (true);
create policy "authenticated delete sanctions" on public.sanctions for delete to authenticated using (true);

-- PARTIDOS MASCULINOS
insert into public.matches(day,gender,group_name,home_team,away_team) values
(1,'M','A','Fortnite','Chifladitos'),
(3,'M','A','Papitos','Trocos'),
(5,'M','A','Finqueros','Fortnite'),
(7,'M','A','Chifladitos','Papitos'),
(9,'M','A','Trocos','Finqueros'),
(11,'M','A','Fortnite','Papitos'),
(13,'M','A','Chifladitos','Finqueros'),
(15,'M','A','Fortnite','Trocos'),
(17,'M','A','Papitos','Finqueros'),
(19,'M','A','Trocos','Chifladitos'),
(2,'M','B','Sin Esquinas','Motoneta'),
(4,'M','B','Osos','La Banca'),
(6,'M','B','Razitos','Sin Esquinas'),
(8,'M','B','Motoneta','Osos'),
(10,'M','B','La Banca','Razitos'),
(12,'M','B','Sin Esquinas','Osos'),
(14,'M','B','Motoneta','Razitos'),
(16,'M','B','Sin Esquinas','La Banca'),
(18,'M','B','Osos','Razitos'),
(20,'M','B','Motoneta','La Banca');

-- PARTIDOS FEMENINOS
insert into public.matches(day,gender,group_name,home_team,away_team) values
(21,'F','Único','Tan G Neras FC','Jags'),
(22,'F','Único','Osas Mañosas','Chapiadoras.com'),
(23,'F','Único','Las Cabritas','Trocas'),
(24,'F','Único','Tan G Neras FC','Chapiadoras.com'),
(25,'F','Único','Jags','Trocas'),
(26,'F','Único','Osas Mañosas','Las Cabritas'),
(27,'F','Único','Tan G Neras FC','Trocas'),
(28,'F','Único','Chapiadoras.com','Las Cabritas'),
(29,'F','Único','Jags','Osas Mañosas'),
(30,'F','Único','Tan G Neras FC','Las Cabritas'),
(31,'F','Único','Trocas','Osas Mañosas'),
(32,'F','Único','Chapiadoras.com','Jags'),
(33,'F','Único','Tan G Neras FC','Osas Mañosas'),
(34,'F','Único','Las Cabritas','Jags'),
(35,'F','Único','Trocas','Chapiadoras.com');
