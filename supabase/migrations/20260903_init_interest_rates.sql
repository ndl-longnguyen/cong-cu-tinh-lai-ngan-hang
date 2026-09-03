-- ==============================================================================
-- MIGRATION: 20260903_init_interest_rates.sql
-- Hệ thống lưu trữ và quản lý lãi suất ngân hàng Việt Nam
-- ==============================================================================

-- 1. BẢNG DANH MỤC NGÂN HÀNG (banks)
create table if not exists banks (
    id uuid primary key default gen_random_uuid(),
    code text unique not null,
    name text not null,
    short_name text not null,
    slug text unique not null,
    official_website text not null,
    official_domain text not null,
    logo text,
    color text,
    established_year integer,
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_banks_slug on banks(slug);
create index if not exists idx_banks_active on banks(active);

-- 2. BẢNG NGUỒN BIỂU LÃI SUẤT CHÍNH THỨC (bank_rate_sources)
create table if not exists bank_rate_sources (
    id uuid primary key default gen_random_uuid(),
    bank_id uuid not null references banks(id) on delete cascade,
    url text not null,
    source_type text not null check (source_type in ('official_page', 'official_pdf', 'sbv', 'news')),
    active boolean not null default true,
    last_checked_at timestamptz,
    last_success_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_bank_sources_bank_id on bank_rate_sources(bank_id);

-- 3. BẢNG LÃI SUẤT HIỆN HÀNH (deposit_rates)
create table if not exists deposit_rates (
    id uuid primary key default gen_random_uuid(),
    bank_id uuid not null references banks(id) on delete cascade,
    currency text not null default 'VND',
    channel text not null check (channel in ('online', 'counter')),
    term_value integer not null check (term_value > 0),
    term_unit text not null check (term_unit in ('day', 'month', 'year')),
    interest_rate numeric(5,2) not null check (interest_rate >= 0 and interest_rate <= 30),
    payment_method text not null default 'maturity' check (payment_method in ('maturity', 'monthly', 'quarterly', 'upfront')),
    min_amount numeric default 0,
    max_amount numeric,
    customer_segment text not null default 'individual',
    note text,
    source_url text,
    effective_at timestamptz,
    verified_at timestamptz not null default now(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uq_deposit_rates unique (bank_id, currency, channel, term_value, term_unit, payment_method, customer_segment)
);

create index if not exists idx_deposit_rates_lookup on deposit_rates(term_value, term_unit, channel, interest_rate desc);
create index if not exists idx_deposit_rates_bank on deposit_rates(bank_id);

-- 4. BẢNG LỊCH SỬ THAY ĐỔI LÃI SUẤT (deposit_rate_history)
create table if not exists deposit_rate_history (
    id uuid primary key default gen_random_uuid(),
    bank_id uuid not null references banks(id) on delete cascade,
    currency text not null default 'VND',
    channel text not null check (channel in ('online', 'counter')),
    term_value integer not null,
    term_unit text not null check (term_unit in ('day', 'month', 'year')),
    payment_method text not null default 'maturity',
    old_rate numeric(5,2),
    new_rate numeric(5,2) not null,
    source_url text,
    detected_at timestamptz not null default now()
);

create index if not exists idx_rate_history_bank on deposit_rate_history(bank_id, term_value, term_unit);
create index if not exists idx_rate_history_date on deposit_rate_history(detected_at desc);

-- 5. BẢNG QUẢN LÝ TIẾN TRÌNH ĐỒNG BỘ (rate_sync_runs)
create table if not exists rate_sync_runs (
    id uuid primary key default gen_random_uuid(),
    started_at timestamptz not null default now(),
    finished_at timestamptz,
    status text not null check (status in ('running', 'completed', 'failed', 'already_running')),
    total_banks integer default 0,
    success_banks integer default 0,
    partial_banks integer default 0,
    failed_banks integer default 0,
    error text
);

create index if not exists idx_rate_sync_runs_status on rate_sync_runs(status, started_at desc);

-- 6. BẢNG KẾT QUẢ ĐỒNG BỘ CHI TIẾT TỪNG NGÂN HÀNG (rate_sync_bank_results)
create table if not exists rate_sync_bank_results (
    id uuid primary key default gen_random_uuid(),
    sync_run_id uuid not null references rate_sync_runs(id) on delete cascade,
    bank_id uuid not null references banks(id) on delete cascade,
    status text not null check (status in ('success', 'partial', 'not_found', 'needs_review', 'failed')),
    old_rate_count integer default 0,
    new_rate_count integer default 0,
    source_url text,
    error text,
    created_at timestamptz not null default now()
);

create index if not exists idx_sync_bank_results on rate_sync_bank_results(sync_run_id, bank_id);

-- ==============================================================================
-- BẢO MẬT: ROW LEVEL SECURITY (RLS)
-- ==============================================================================
alter table banks enable row level security;
alter table bank_rate_sources enable row level security;
alter table deposit_rates enable row level security;
alter table deposit_rate_history enable row level security;
alter table rate_sync_runs enable row level security;
alter table rate_sync_bank_results enable row level security;

-- Cho phép đọc công khai dữ liệu phục vụ người dùng xem trang web
create policy "Allow public read access on banks" on banks for select using (true);
create policy "Allow public read access on deposit_rates" on deposit_rates for select using (true);
create policy "Allow public read access on deposit_rate_history" on deposit_rate_history for select using (true);
create policy "Allow public read access on bank_rate_sources" on bank_rate_sources for select using (true);

-- Chỉ service_role mới có quyền ghi dữ liệu (Cron Sync & Admin)
create policy "Allow service_role full access on banks" on banks for all using (auth.role() = 'service_role');
create policy "Allow service_role full access on bank_rate_sources" on bank_rate_sources for all using (auth.role() = 'service_role');
create policy "Allow service_role full access on deposit_rates" on deposit_rates for all using (auth.role() = 'service_role');
create policy "Allow service_role full access on deposit_rate_history" on deposit_rate_history for all using (auth.role() = 'service_role');
create policy "Allow service_role full access on rate_sync_runs" on rate_sync_runs for all using (auth.role() = 'service_role');
create policy "Allow service_role full access on rate_sync_bank_results" on rate_sync_bank_results for all using (auth.role() = 'service_role');
