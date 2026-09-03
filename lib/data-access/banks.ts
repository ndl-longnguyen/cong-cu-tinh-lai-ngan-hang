import { getSupabaseServerClient } from "@/lib/supabase/server";
import { MASTER_BANKS, MasterBank } from "./seed-data";

/**
 * Lấy danh sách toàn bộ các ngân hàng đang hoạt động
 */
export async function getBanks(): Promise<MasterBank[]> {
  try {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("banks")
        .select("*")
        .eq("active", true)
        .order("short_name", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as MasterBank[];
      }
    }
  } catch (err) {
    console.warn("Could not load banks from Supabase, using last-known-good fallback", err);
  }

  // Fallback to verified master data
  return MASTER_BANKS.filter((b) => b.active);
}

/**
 * Lấy thông tin chi tiết một ngân hàng theo slug
 */
export async function getBankBySlug(slug: string): Promise<MasterBank | null> {
  try {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("banks")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return data as MasterBank;
      }
    }
  } catch (err) {
    console.warn(`Could not load bank ${slug} from Supabase, using fallback`, err);
  }

  const found = MASTER_BANKS.find((b) => b.slug === slug);
  return found || null;
}

/**
 * Lấy thông tin ngân hàng theo mã ID
 */
export async function getBankById(id: string): Promise<MasterBank | null> {
  try {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("banks")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        return data as MasterBank;
      }
    }
  } catch (err) {
    console.warn(`Could not load bank ID ${id} from Supabase, using fallback`, err);
  }

  const found = MASTER_BANKS.find((b) => b.id === id);
  return found || null;
}
