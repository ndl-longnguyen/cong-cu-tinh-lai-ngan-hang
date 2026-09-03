import { Client } from "pg";
import { MASTER_BANKS, BASELINE_RATES } from "../lib/data-access/seed-data";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vpgamdtqigywphpuwsen.supabase.co";
const projectRef = url.replace("https://", "").split(".")[0];
const dbPass = process.env.DB_PASS || "yTE8TUR7qYeKoPdc";

const regions = [
  "ap-southeast-2", // Sydney (vpgamdtqigywphpuwsen)
  "ap-northeast-1", // Tokyo (jgtesumifnovjxckbgge)
  "ap-southeast-1", // Singapore
  "ap-northeast-2", // Seoul
  "us-east-1",
  "us-west-1",
  "eu-central-1",
];

async function run() {
  console.log(`🚀 Bắt đầu migrate schema cho Supabase project: ${projectRef}...`);

  let connectedClient: Client | null = null;
  let matchedRegion = "";

  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const client = new Client({
      host,
      port: 5432,
      user: `postgres.${projectRef}`,
      password: dbPass,
      database: "postgres",
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });

    try {
      process.stdout.write(`Đang thử kết nối ${region}... `);
      await client.connect();
      console.log("✅ Kết nối thành công!");
      connectedClient = client;
      matchedRegion = region;
      break;
    } catch (e: any) {
      console.log(`❌ (${e.message})`);
      await client.end().catch(() => {});
    }
  }

  if (!connectedClient) {
    console.error("❌ Không thể kết nối tới bất kỳ vùng pooler nào của Supabase.");
    process.exit(1);
  }

  console.log(`\n⚡ Đang khởi tạo các bảng và thiết lập RLS trên ${matchedRegion}...`);
  await connectedClient.query(`
    DROP TABLE IF EXISTS rate_sync_bank_results CASCADE;
    DROP TABLE IF EXISTS rate_sync_runs CASCADE;
    DROP TABLE IF EXISTS deposit_rate_history CASCADE;
    DROP TABLE IF EXISTS deposit_rates CASCADE;
    DROP TABLE IF EXISTS bank_rate_sources CASCADE;
    DROP TABLE IF EXISTS banks CASCADE;

    CREATE TABLE banks (
      id text primary key,
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

    CREATE TABLE bank_rate_sources (
      id uuid primary key default gen_random_uuid(),
      bank_id text not null references banks(id) on delete cascade,
      url text not null,
      source_type text not null default 'official_page',
      active boolean not null default true,
      last_checked_at timestamptz,
      last_success_at timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    CREATE TABLE deposit_rates (
      id uuid primary key default gen_random_uuid(),
      bank_id text not null references banks(id) on delete cascade,
      currency text not null default 'VND',
      channel text not null check (channel in ('online', 'counter')),
      term_value integer not null check (term_value > 0),
      term_unit text not null check (term_unit in ('day', 'month', 'year')),
      interest_rate numeric(5,2) not null check (interest_rate >= 0 and interest_rate <= 30),
      payment_method text not null default 'maturity',
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

    CREATE TABLE deposit_rate_history (
      id uuid primary key default gen_random_uuid(),
      bank_id text not null references banks(id) on delete cascade,
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

    CREATE TABLE rate_sync_runs (
      id text primary key,
      status text not null,
      total_banks integer not null default 0,
      success_banks integer not null default 0,
      partial_banks integer not null default 0,
      failed_banks integer not null default 0,
      error_message text,
      started_at timestamptz not null default now(),
      finished_at timestamptz
    );

    CREATE TABLE rate_sync_bank_results (
      id uuid primary key default gen_random_uuid(),
      sync_run_id text not null references rate_sync_runs(id) on delete cascade,
      bank_id text not null references banks(id) on delete cascade,
      status text not null,
      old_rate_count integer not null default 0,
      new_rate_count integer not null default 0,
      source_url text,
      error text,
      created_at timestamptz not null default now()
    );

    -- Enable RLS
    ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
    ALTER TABLE bank_rate_sources ENABLE ROW LEVEL SECURITY;
    ALTER TABLE deposit_rates ENABLE ROW LEVEL SECURITY;
    ALTER TABLE deposit_rate_history ENABLE ROW LEVEL SECURITY;
    ALTER TABLE rate_sync_runs ENABLE ROW LEVEL SECURITY;
    ALTER TABLE rate_sync_bank_results ENABLE ROW LEVEL SECURITY;

    -- Public read policies
    CREATE POLICY "Allow public read for banks" ON banks FOR SELECT USING (true);
    CREATE POLICY "Allow public read for bank_rate_sources" ON bank_rate_sources FOR SELECT USING (true);
    CREATE POLICY "Allow public read for deposit_rates" ON deposit_rates FOR SELECT USING (true);
    CREATE POLICY "Allow public read for deposit_rate_history" ON deposit_rate_history FOR SELECT USING (true);
    CREATE POLICY "Allow public read for rate_sync_runs" ON rate_sync_runs FOR SELECT USING (true);
    CREATE POLICY "Allow public read for rate_sync_bank_results" ON rate_sync_bank_results FOR SELECT USING (true);
  `);

  console.log("🌱 Đang seed danh mục 30 ngân hàng...");
  for (const b of MASTER_BANKS) {
    await connectedClient.query(
      `INSERT INTO banks (id, code, name, short_name, slug, official_website, official_domain, established_year, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
       ON CONFLICT (id) DO NOTHING`,
      [b.id, b.code, b.name, b.short_name, b.slug, b.official_website, b.official_domain, b.established_year]
    );
  }

  console.log("🌱 Đang seed 540 bản ghi biểu lãi suất chuẩn...");
  for (const r of BASELINE_RATES) {
    await connectedClient.query(
      `INSERT INTO deposit_rates (bank_id, currency, channel, term_value, term_unit, interest_rate, payment_method, min_amount, customer_segment, source_url, verified_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (bank_id, currency, channel, term_value, term_unit, payment_method, customer_segment) DO NOTHING`,
      [r.bank_id, r.currency, r.channel, r.term_value, r.term_unit, r.interest_rate, r.payment_method, r.min_amount || 0, r.customer_segment || "individual", r.source_url, r.verified_at]
    );
  }

  const resBanks = await connectedClient.query("SELECT COUNT(*) FROM banks");
  const resRates = await connectedClient.query("SELECT COUNT(*) FROM deposit_rates");
  console.log(`\n🎉 HOÀN TẤT MIGRATION THÀNH CÔNG!`);
  console.log(`- Số ngân hàng: ${resBanks.rows[0].count}`);
  console.log(`- Số mức lãi suất: ${resRates.rows[0].count}`);

  await connectedClient.end();
}

run().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
