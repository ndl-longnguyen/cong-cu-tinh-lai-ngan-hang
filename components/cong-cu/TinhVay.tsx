"use client";

import React, { useState, useMemo } from "react";
import { History, RotateCcw, Info, Landmark, CheckCircle2, Sliders } from "lucide-react";
import { calculateReducingBalanceLoan, calculateAnnuityLoan } from "@/lib/finance/loan";
import { dinhDangTien } from "@/lib/dinh-dang";

export function TinhVay() {
  const [soTienVay, setSoTienVay] = useState<number>(500000000);
  const [laiSuat, setLaiSuat] = useState<number>(10.5);
  const [kyHan, setKyHan] = useState<number>(60);
  const [hinhThuc, setHinhThuc] = useState<"du-no-giam-dan" | "tra-goc-deu">("du-no-giam-dan");

  // Advanced options: Lãi suất ưu đãi thời gian đầu
  const [hasPromo, setHasPromo] = useState<boolean>(false);
  const [promoMonths, setPromoMonths] = useState<number>(12);
  const [promoRate, setPromoRate] = useState<number>(7.5);

  const ketQua = useMemo(() => {
    const options = hasPromo ? { promoMonths, promoRate } : undefined;
    return hinhThuc === "du-no-giam-dan"
      ? calculateReducingBalanceLoan(soTienVay, laiSuat, kyHan, options)
      : calculateAnnuityLoan(soTienVay, laiSuat, kyHan, options);
  }, [soTienVay, laiSuat, kyHan, hinhThuc, hasPromo, promoMonths, promoRate]);

  const handleReset = () => {
    setSoTienVay(500000000);
    setLaiSuat(10.5);
    setKyHan(60);
    setHinhThuc("du-no-giam-dan");
    setHasPromo(false);
    setPromoMonths(12);
    setPromoRate(7.5);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              Thông tin khoản vay
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Đặt lại
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Số tiền vay (VND)
            </label>
            <input
              type="number"
              value={soTienVay}
              onChange={(e) => setSoTienVay(Number(e.target.value))}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
            />
            <div className="mt-1 text-xs text-muted-foreground">
              Bằng chữ: <span className="font-medium text-foreground">{dinhDangTien(soTienVay)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Lãi suất cơ sở (%/năm)
              </label>
              <input
                type="number"
                step="0.1"
                value={laiSuat}
                onChange={(e) => setLaiSuat(Number(e.target.value))}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Thời hạn vay (tháng)
              </label>
              <input
                type="number"
                min="1"
                max="360"
                value={kyHan}
                onChange={(e) => setKyHan(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
              Phương thức trả nợ
              <span title="Dư nợ giảm dần: Gốc đều, lãi giảm dần. Trả góp đều: Tổng số tiền trả cố định mỗi tháng.">
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
              <button
                type="button"
                onClick={() => setHinhThuc("du-no-giam-dan")}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                  hinhThuc === "du-no-giam-dan"
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Dư nợ giảm dần
              </button>
              <button
                type="button"
                onClick={() => setHinhThuc("tra-goc-deu")}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                  hinhThuc === "tra-goc-deu"
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Trả góp đều (PMT)
              </button>
            </div>
          </div>

          {/* Gói Lãi suất ưu đãi ban đầu */}
          <div className="pt-3 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer select-none mb-3">
              <input
                type="checkbox"
                checked={hasPromo}
                onChange={(e) => setHasPromo(e.target.checked)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Sliders className="h-3.5 w-3.5 text-primary" />
                Có gói lãi suất ưu đãi ban đầu
              </span>
            </label>

            {hasPromo && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-primary/5 rounded-xl border border-primary/15">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Thời gian ưu đãi (tháng)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={kyHan}
                    value={promoMonths}
                    onChange={(e) => setPromoMonths(Number(e.target.value))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Lãi suất ưu đãi (%/năm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={promoRate}
                    onChange={(e) => setPromoRate(Number(e.target.value))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-amber-500/10 rounded-2xl p-5 border border-amber-500/20 space-y-2">
          <h4 className="font-semibold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-2">
            <Info className="h-4 w-4" />
            Lưu ý tài chính thực tế khi vay vốn
          </h4>
          <ul className="text-xs text-amber-900/80 dark:text-amber-200/80 space-y-1.5 list-disc pl-4">
            <li>Sau thời gian ưu đãi, lãi suất thường thả nổi theo công thức: <em>Lãi suất tham chiếu + Biên độ (3% - 4.5%)</em>.</li>
            <li>Phí bảo hiểm khoản vay (nếu có) thường từ 1% - 1.5%/năm trên dư nợ.</li>
            <li>Phí trả nợ trước hạn phổ biến từ 0.5% - 2% số tiền trả trước hạn trong 3-5 năm đầu.</li>
          </ul>
        </div>
      </div>

      {/* Result Section */}
      <div className="lg:col-span-7 space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <div className="text-xs text-muted-foreground mb-1">
              {hinhThuc === "du-no-giam-dan" ? "Trả tháng đầu cao nhất" : "Trả góp đều hàng tháng"}
            </div>
            <div className="text-lg lg:text-xl font-bold text-primary">
              {dinhDangTien(ketQua.firstMonthPayment)}
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <div className="text-xs text-muted-foreground mb-1">Tổng tiền lãi phải trả</div>
            <div className="text-lg lg:text-xl font-bold text-destructive">
              {dinhDangTien(ketQua.totalInterest)}
            </div>
          </div>
          <div className="bg-primary rounded-2xl p-5 shadow-md text-primary-foreground">
            <div className="text-xs text-primary-foreground/80 mb-1">Tổng số tiền trả (Gốc + Lãi)</div>
            <div className="text-lg lg:text-xl font-bold">
              {dinhDangTien(ketQua.totalPaid)}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Lịch trả nợ chi tiết (Amortization)</h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <History className="h-4 w-4" />
              <span>{kyHan} kỳ thanh toán</span>
            </div>
          </div>
          <div className="overflow-y-auto max-h-[440px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card z-10">
                <tr className="bg-muted/60 border-b border-border text-xs text-muted-foreground">
                  <th className="px-5 py-3 text-center">Kỳ</th>
                  <th className="px-5 py-3 text-right">Gốc trả</th>
                  <th className="px-5 py-3 text-right">Lãi trả</th>
                  <th className="px-5 py-3 text-right">Tổng trả kỳ này</th>
                  <th className="px-5 py-3 text-right">Dư nợ còn lại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ketQua.schedule.map((item) => (
                  <tr key={item.period} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 text-center font-medium text-muted-foreground">
                      Kỳ {item.period}
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground">
                      {dinhDangTien(item.principalPaid)}
                    </td>
                    <td className="px-5 py-3 text-right text-destructive font-medium">
                      {dinhDangTien(item.interestPaid)}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-foreground">
                      {dinhDangTien(item.totalPaid)}
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground font-medium">
                      {dinhDangTien(item.remainingPrincipal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span>
            Kỳ trả nợ cuối cùng được thuật toán tự động cân bằng triệt tiêu hoàn toàn dư nợ gốc về chính xác 0đ.
          </span>
        </div>
      </div>
    </div>
  );
}
