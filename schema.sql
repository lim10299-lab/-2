-- =====================================================================
-- 3사 근무지원단 가족소통마당 · Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- 기획서의 원칙을 DB 수준에서 강제합니다:
--   · 가입 승인제 폐쇄형: 승인된 회원만 내용을 볼 수 있음
--   · 게시 승인: status='approved' 인 활동만 부모님에게 보임
--   · 1:1 문의·응원 메시지: 본인과 담당 근무대 간부만 열람
-- =====================================================================

-- 근무대 코드
create type unit_slug as enum ('medical','hq','facility','supply','maintenance','band','signal');
create type member_role as enum ('parent','staff','reviewer','admin');
create type member_status as enum ('pending','approved','dormant','rejected');

-- 회원 프로필 (auth.users 와 1:1)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  role member_role not null default 'parent',
  status member_status not null default 'pending',
  unit unit_slug,                 -- 부모님: 자녀 근무대 / 간부: 담당 근무대
  child_name text,                -- 부모님만
  relation text,                  -- 부, 모, 기타 가족
  child_discharge_date date,      -- 전역 후 휴면 처리 기준
  fav_units unit_slug[] default '{}',
  created_at timestamptz default now()
);

-- 알림 설정
create table public.notification_prefs (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  channel text not null default 'push' check (channel in ('push','kakao')),
  post boolean default true,
  answer boolean default true,
  event boolean default true,
  cheer boolean default true,
  letter boolean default false
);

-- 웹 푸시 구독 정보
create table public.push_subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  keys jsonb not null,
  created_at timestamptz default now()
);

-- 주요활동 게시물 (작성 → 검토 → 승인 → 게시)
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  unit unit_slug not null,
  type text not null check (type in ('교육지원','훈련','행사','체육·여가','포상·승진','봉사')),
  title text not null,
  summary text not null,
  date date not null default current_date,
  image_url text,                 -- Supabase Storage 'activity-photos' 버킷
  cheers int not null default 0,
  comments int not null default 0,
  status text not null default 'review' check (status in ('draft','review','approved','rejected')),
  reject_reason text,
  security_checked boolean not null default false,
  author_id uuid references public.profiles(id),
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz default now()
);

-- 응원해요(반응) — 1인 1회
create table public.activity_cheers (
  activity_id uuid references public.activities(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  primary key (activity_id, user_id)
);

-- 댓글 (사후 모니터링)
create table public.activity_comments (
  id bigint generated always as identity primary key,
  activity_id uuid references public.activities(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) <= 300),
  hidden boolean default false,
  created_at timestamptz default now()
);

-- 근무대 소통방 메시지 (Realtime 구독 대상)
create table public.chat_messages (
  id bigint generated always as identity primary key,
  unit unit_slug not null,
  user_id uuid references public.profiles(id) on delete set null,
  author text not null,           -- 표시 이름 예) ○○○ 일병 어머님
  role member_role not null,
  body text not null check (char_length(body) <= 1000),
  hidden boolean default false,
  created_at timestamptz default now()
);

-- 1:1 문의
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  unit unit_slug not null,
  category text not null check (category in ('건강·의료','휴가·면회·외출','생활·고충','행사·방문','기타')),
  title text not null,
  body text not null,
  status text not null default '접수' check (status in ('접수','확인 중','답변 완료')),
  answer text,
  answered_by text,
  answered_at timestamptz,
  created_at timestamptz default now()
);

-- 응원 메시지 (부모님 → 자녀, 간부가 주 1회 전달)
create table public.cheer_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  unit unit_slug not null,
  to_name text not null,
  body text not null check (char_length(body) <= 500),
  special boolean default false,  -- 생일·기념일(당일 전달)
  delivered boolean default false,
  reply text,
  created_at timestamptz default now()
);

-- 일정 (공개 가능한 일정만)
create table public.events (
  id uuid primary key default gen_random_uuid(),
  unit text not null default 'all',
  title text not null,
  date date not null,
  time text,
  place text,
  kind text not null check (kind in ('행사','면회·개방','수료·전역','온라인')),
  description text
);

create table public.event_applications (
  event_id uuid references public.events(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  headcount int default 1,
  created_at timestamptz default now(),
  primary key (event_id, user_id)
);

create table public.notices (
  id uuid primary key default gen_random_uuid(),
  unit text not null default 'all',
  title text not null,
  body text,
  date date not null default current_date,
  pinned boolean default false
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  question text not null,
  answer text not null
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('생활 안내','신청 양식','운영 정책')),
  date date not null default current_date,
  file_url text                   -- Supabase Storage 'resources' 버킷
);

-- ---------------------------------------------------------------------
-- 권한 도우미 함수
-- ---------------------------------------------------------------------
create or replace function public.me() returns public.profiles
language sql stable security definer set search_path = public as $$
  select * from public.profiles where id = auth.uid()
$$;

create or replace function public.is_approved() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and status = 'approved')
$$;

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and status = 'approved' and role in ('staff','reviewer','admin'))
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and status = 'approved' and role in ('reviewer','admin'))
$$;

-- ---------------------------------------------------------------------
-- 행 수준 보안 (RLS)
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.notification_prefs enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.activities enable row level security;
alter table public.activity_cheers enable row level security;
alter table public.activity_comments enable row level security;
alter table public.chat_messages enable row level security;
alter table public.inquiries enable row level security;
alter table public.cheer_messages enable row level security;
alter table public.events enable row level security;
alter table public.event_applications enable row level security;
alter table public.notices enable row level security;
alter table public.faqs enable row level security;
alter table public.resources enable row level security;

-- 프로필: 본인 조회·가입신청, 간부는 자기 근무대 회원 조회·승인
create policy "profile self read" on public.profiles for select using (id = auth.uid() or public.is_staff());
create policy "profile self insert" on public.profiles for insert with check (id = auth.uid() and role = 'parent' and status = 'pending');
-- 본인은 이름·연락처·관심 근무대만 바꿀 수 있고, 역할·승인 상태는 바꿀 수 없습니다.
create policy "profile self update" on public.profiles for update using (id = auth.uid())
  with check (role = (public.me()).role and status = (public.me()).status);
create policy "profile staff approve" on public.profiles for update using (public.is_staff() and (public.is_admin() or unit = (public.me()).unit));

create policy "prefs self" on public.notification_prefs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "push self" on public.push_subscriptions for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 활동: 승인 회원은 승인된 게시물만, 간부는 작성·검토 대상까지
create policy "activities read" on public.activities for select using ((public.is_approved() and status = 'approved') or public.is_staff());
create policy "activities write" on public.activities for insert with check (public.is_staff() and status in ('draft','review'));
create policy "activities update" on public.activities for update using (public.is_staff())
  with check (status <> 'approved' or (public.is_admin() and security_checked));

create policy "cheers read" on public.activity_cheers for select using (public.is_approved());
create policy "cheers self" on public.activity_cheers for insert with check (user_id = auth.uid() and public.is_approved());
create policy "cheers undo" on public.activity_cheers for delete using (user_id = auth.uid());

create policy "comments read" on public.activity_comments for select using (public.is_approved() and (not hidden or public.is_staff()));
create policy "comments write" on public.activity_comments for insert with check (user_id = auth.uid() and public.is_approved());
create policy "comments moderate" on public.activity_comments for update using (public.is_staff());

-- 소통방: 같은 근무대 승인 회원과 간부만
create policy "chat read" on public.chat_messages for select using (
  public.is_approved() and (unit = (public.me()).unit or public.is_admin()) and (not hidden or public.is_staff()));
create policy "chat write" on public.chat_messages for insert with check (
  user_id = auth.uid() and public.is_approved() and unit = (public.me()).unit);
create policy "chat moderate" on public.chat_messages for update using (public.is_staff());

-- 1:1 문의: 본인 + 해당 근무대 간부
create policy "inquiry read" on public.inquiries for select using (
  user_id = auth.uid() or (public.is_staff() and (unit = (public.me()).unit or public.is_admin())));
create policy "inquiry write" on public.inquiries for insert with check (user_id = auth.uid() and public.is_approved() and status = '접수');
create policy "inquiry answer" on public.inquiries for update using (public.is_staff() and (unit = (public.me()).unit or public.is_admin()));

-- 응원 메시지: 본인 + 해당 근무대 간부
create policy "cheer msg read" on public.cheer_messages for select using (
  user_id = auth.uid() or (public.is_staff() and (unit = (public.me()).unit or public.is_admin())));
create policy "cheer msg write" on public.cheer_messages for insert with check (user_id = auth.uid() and public.is_approved());
create policy "cheer msg deliver" on public.cheer_messages for update using (public.is_staff() and (unit = (public.me()).unit or public.is_admin()));

-- 공개 정보(일정·공지·FAQ·자료): 승인 회원 열람, 간부 관리
create policy "events read" on public.events for select using (public.is_approved());
create policy "events manage" on public.events for all using (public.is_staff()) with check (public.is_staff());
create policy "apply self" on public.event_applications for all using (user_id = auth.uid() or public.is_staff()) with check (user_id = auth.uid());
create policy "notices read" on public.notices for select using (public.is_approved());
create policy "notices manage" on public.notices for all using (public.is_staff()) with check (public.is_staff());
create policy "faqs read" on public.faqs for select using (true);  -- FAQ는 로그인 전에도 공개
create policy "faqs manage" on public.faqs for all using (public.is_staff()) with check (public.is_staff());
create policy "resources read" on public.resources for select using (public.is_approved());
create policy "resources manage" on public.resources for all using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------------
-- 실시간(Realtime): 소통방 메시지와 문의 상태 변경을 구독
-- ---------------------------------------------------------------------
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.inquiries;

-- 응원해요 수 자동 집계
create or replace function public.sync_cheer_count() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.activities
     set cheers = (select count(*) from public.activity_cheers where activity_id = coalesce(new.activity_id, old.activity_id))
   where id = coalesce(new.activity_id, old.activity_id);
  return null;
end $$;

create trigger cheers_count after insert or delete on public.activity_cheers
for each row execute function public.sync_cheer_count();

-- ---------------------------------------------------------------------
-- Storage 버킷 (대시보드 > Storage 에서 만들어도 됩니다)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('activity-photos', 'activity-photos', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('resources', 'resources', false) on conflict do nothing;
-- 사진은 비공개 버킷 + 서명 URL(createSignedUrl)로 승인 회원에게만 보여 주는 것을 권장합니다.
