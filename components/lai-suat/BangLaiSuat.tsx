"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowUpDown, ExternalLink, TrendingUp, ShieldCheck, Clock } from "lucide-react";
import { dinhDangPhanTram } from "@/lib/dinh-dang";
import { MASTER_BANKS, BASELINE_RATES } from "@/lib/data-access/seed-data";

export function BangLaiSuat() {
  const [timKiem, setTimKiem] = useState("");
  const [kyHanLoc, setKyHanLoc] = useState<number>(12);
  const [hinhThucLoc, setHinhThucLoc] = useState<"online" | "counter">("online");
  const [sapXep, setSapXep] = useState<"cao-den-thap" | "thap-den-cao">("cao-den-thap");

  const bankMap = useMemo(() => {
    return new Map(MASTER_BANKS.map((b) => [b.id, b]));
  }, []);

  const duLieuHienThi = useMemo(() => {
    let result = BASELINE_RATES.filter(
      (ls) => ls.term_value === kyHanLoc && ls.channel === hinhThucLoc
    ).map((ls) => ({
      ...ls,
      bank: bankMap.get(ls.bank_id),
    }));

    if (timKiem.trim()) {
      const q = timKiem.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.bank?.name.toLowerCase().includes(q) ||
          item.bank?.short_name.toLowerCase().includes(q) ||
          item.bank?.code.toLowerCase().includes(q)
      );
    }

    if (sapXep === "cao-den-thap") {
      result.sort((a, b) => b.interest_rate - a.interest_rate);
    } else {
      result.sort((a, b) => a.interest_rate - b.interest_rate);
    }

    return result;
  }, [bankMap, kyHanLoc, hinhThucLoc, timKiem, sapXep]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm tên ngân hàng (Vietcombank, ACB, TCB...)..."
              value={timKiem}
              onChange={(e) => setTimKiem(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
          </div>
          <div>
            <select
              value={kyHanLoc}
              onChange={(e) => setKyHanLoc(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            >
              {[1, 2, 3, 6, 9, 12, 18, 24, 36].map((k) => (
                <option key={k} value={k}>
                  Kỳ hạn {k} tháng
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={hinhThucLoc}
              onChange={(e) => setHinhThucLoc(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            >
              <option value="online">Gửi Online (Trực tuyến)</option>
              <option value="counter">Gửi Tại quầy giao dịch</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60 border-b border-border text-xs text-muted-foreground">
                <th className="px-6 py-4 text-left font-semibold">Ngân hàng</th>
                <th
                  className="px-6 py-4 text-center font-semibold cursor-pointer hover:text-primary transition-colors select-none"
                  onClick={() =>
                    setSapXep(sapXep === "cao-den-thap" ? "thap-den-cao" : "cao-den-thap")
                  }
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Lãi suất (%/năm)</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th className="px-6 py-4 text-center font-semibold">Độ tươi & Nguồn</th>
                <th className="px-6 py-4 text-center font-semibold">Hình thức</th>
                <th className="px-6 py-4 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {duLieuHienThi.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center font-bold text-xs text-primary group-hover:bg-primary/10 transition-colors border border-border">
                        {item.bank?.code || item.bank?.short_name.substring(0, 3)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                          <span>{item.bank?.short_name}</span>
                          <span className="text-xs text-muted-foreground font-normal hidden sm:inline">
                            ({item.bank?.name})
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {item.bank?.official_domain}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-bold text-base">
                      {dinhDangPhanTram(item.interest_rate)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <ShieldCheck className="h-3 w-3" />
                        Xác minh: {item.verified_at}
                      </span>
                      {item.source_url && (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-0.5 underline"
                        >
                          Xem nguồn gốc
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                        item.channel === "online"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-orange-50 text-orange-700 border border-orange-200"
                      }`}
                    >
                      {item.channel === "online" ? "Online" : "Tại quầy"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/cong-cu/tinh-lai-tiet-kiem?bank=${item.bank_id}&term=${item.term_value}`}
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        Tính tiền lãi
                      </Link>
                      <Link
                        href={`/ngan-hang/${item.bank?.slug}`}
                        className="text-muted-foreground hover:text-foreground text-xs"
                      >
                        Chi tiết
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {duLieuHienThi.length === 0 && (
          <div className="py-16 text-center text-muted-foreground text-sm">
            Không tìm thấy dữ liệu phù hợp với bộ lọc tìm kiếm.
          </div>
        )}
      </div>

      {/* Tip Section */}
      <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
        <TrendingUp className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-primary">Nguyên tắc minh bạch dữ liệu:</span> Toàn bộ biểu lãi suất hiển thị trên hệ thống đều có nguồn gốc được kiểm chứng đối chiếu trực tiếp từ website chính thức của từng ngân hàng. Dữ liệu được bảo toàn theo nguyên tắc Last-Known-Good để bảo vệ người dùng khỏi các thông tin giả mạo.
        </div>
      </div>
    </div>
  );
}
