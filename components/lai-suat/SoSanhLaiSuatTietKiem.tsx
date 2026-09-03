"use client";

import React, { useState, useMemo } from "react";
import { ArrowDownUp, CheckCircle, ExternalLink, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { dinhDangPhanTram, dinhDangTien } from "@/lib/dinh-dang";
import { MASTER_BANKS, BASELINE_RATES } from "@/lib/data-access/seed-data";
import { calculateDepositInterestActualDays } from "@/lib/finance/deposit";
import { countActualDays, getMaturityDate } from "@/lib/finance/date-calculation";

export function SoSanhLaiSuatTietKiem() {
  const [soTien, setSoTien] = useState<number>(200000000);
  const [kyHan, setKyHan] = useState<number>(12);
  const [channel, setChannel] = useState<"online" | "counter">("online");

  const bankMap = useMemo(() => new Map(MASTER_BANKS.map((b) => [b.id, b])), []);

  const results = useMemo(() => {
    const today = new Date();
    const maturity = getMaturityDate(today, kyHan);
    const actualDays = countActualDays(today, maturity);

    const matchingRates = BASELINE_RATES.filter(
      (r) => r.term_value === kyHan && r.channel === channel
    );

    const computed = matchingRates.map((r) => {
      const calc = calculateDepositInterestActualDays(soTien, r.interest_rate, actualDays);
      return {
        ...r,
        bank: bankMap.get(r.bank_id),
        interest: calc.interest,
        totalMaturity: calc.totalMaturity,
        actualDays,
      };
    });

    computed.sort((a, b) => b.interest - a.interest);
    return computed;
  }, [soTien, kyHan, channel, bankMap]);

  const maxInterest = results[0]?.interest || 0;
  const minInterest = results[results.length - 1]?.interest || 0;
  const spread = maxInterest - minInterest;

  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ArrowDownUp className="h-5 w-5 text-primary" />
            So sánh lợi nhuận thực tế giữa các ngân hàng
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Xếp hạng ngân hàng đem lại số tiền lãi cao nhất với số tiền và kỳ hạn của bạn.
          </p>
        </div>

        {/* Quick parameters */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Số tiền gửi</span>
            <input
              type="number"
              value={soTien}
              onChange={(e) => setSoTien(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg border border-input bg-background text-sm font-semibold w-40"
            />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Kỳ hạn</span>
            <select
              value={kyHan}
              onChange={(e) => setKyHan(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg border border-input bg-background text-sm font-semibold outline-none"
            >
              {[1, 2, 3, 6, 9, 12, 18, 24, 36].map((k) => (
                <option key={k} value={k}>
                  {k} tháng
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Hình thức</span>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-input bg-background text-sm font-semibold outline-none"
            >
              <option value="online">Gửi Online</option>
              <option value="counter">Tại quầy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Difference Highlights */}
      {results.length > 1 && (
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900">
            <div className="text-xs text-emerald-700">Ngân hàng dẫn đầu kỳ hạn {kyHan} tháng</div>
            <div className="text-lg font-bold mt-1">
              {results[0].bank?.short_name}: {dinhDangPhanTram(results[0].interest_rate)}
            </div>
            <div className="text-xs text-emerald-800 mt-1">
              Lãi ước tính: <span className="font-bold">{dinhDangTien(results[0].interest)}</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900">
            <div className="text-xs text-blue-700">Chênh lệch tối đa giữa các ngân hàng</div>
            <div className="text-lg font-bold mt-1 text-primary">
              +{dinhDangTien(spread)}
            </div>
            <div className="text-xs text-blue-800 mt-1">
              Khác biệt giữa lãi suất cao nhất ({dinhDangPhanTram(results[0].interest_rate)}) và thấp nhất ({dinhDangPhanTram(results[results.length - 1].interest_rate)})
            </div>
          </div>
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900">
            <div className="text-xs text-amber-700">Lời khuyên tối ưu</div>
            <div className="text-xs leading-relaxed mt-1">
              Gửi Online giúp bạn nhận thêm từ <strong>0.2% - 0.5%/năm</strong> so với gửi tại quầy cho cùng số tiền và kỳ hạn.
            </div>
          </div>
        </div>
      )}

      {/* Ranked Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 border-b border-border text-xs text-muted-foreground">
              <th className="px-4 py-3 text-center w-12">Hạng</th>
              <th className="px-4 py-3 text-left">Ngân hàng</th>
              <th className="px-4 py-3 text-center">Lãi suất</th>
              <th className="px-4 py-3 text-right">Tiền lãi ước tính</th>
              <th className="px-4 py-3 text-right">Tổng tiền đáo hạn</th>
              <th className="px-4 py-3 text-center">Xác minh & Nguồn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {results.map((item, idx) => (
              <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 text-center font-bold">
                  {idx === 0 ? (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-white text-xs font-black">
                      1
                    </span>
                  ) : idx === 1 ? (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-slate-800 text-xs font-bold">
                      2
                    </span>
                  ) : idx === 2 ? (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-700/60 text-white text-xs font-bold">
                      3
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">{idx + 1}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-foreground">{item.bank?.short_name}</div>
                  <div className="text-xs text-muted-foreground">{item.bank?.name}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="font-bold text-secondary text-sm">
                    {dinhDangPhanTram(item.interest_rate)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-bold text-foreground">
                  {dinhDangTien(item.interest)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-primary">
                  {dinhDangTien(item.totalMaturity)}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <span className="text-[11px] bg-muted px-2 py-0.5 rounded">
                      {item.verified_at}
                    </span>
                    {item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-0.5"
                      >
                        Nguồn
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
