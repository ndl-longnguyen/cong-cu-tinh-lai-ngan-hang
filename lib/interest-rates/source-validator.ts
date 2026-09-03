/**
 * Kiểm tra xem source URL có thuộc official domain của ngân hàng hay không.
 * Ngăn chặn tuyệt đối việc AI lấy nguồn từ các blog, diễn đàn hoặc trang không chính thống.
 */
export function isOfficialSource(sourceUrl: string, officialDomain: string): boolean {
  if (!sourceUrl || !officialDomain) {
    return false;
  }

  try {
    const parsed = new URL(sourceUrl);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const domain = officialDomain.toLowerCase().replace(/^www\./, "").trim();

    return hostname === domain || hostname.endsWith(`.${domain}`);
  } catch {
    return false;
  }
}

/**
 * Lọc và chỉ giữ lại các nguồn hợp lệ từ danh sách
 */
export function filterOfficialSources(
  sources: { url: string }[],
  officialDomain: string
): { url: string }[] {
  return sources.filter((s) => isOfficialSource(s.url, officialDomain));
}
