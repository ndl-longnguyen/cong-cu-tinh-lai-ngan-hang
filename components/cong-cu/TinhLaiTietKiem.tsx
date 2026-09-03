"use client";

import React, { useState, useMemo } from "react";
import { Calculator, RotateCcw, TrendingUp, Wallet, Landmark, Calendar, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import { dinhDangTien, dinhDangPhanTram } from "@/lib/dinh-dang";
import { MASTER_BANKS, BASELINE_RATES } from "@/lib/data-access/seed-data";
import { calculateFixedTermDeposit, calculateRecurringSavings } from "@/lib/finance/deposit";
import { countActualDays, formatDateISO, getMaturityDate } from "@/lib/finance/date-calculation";

export function TinhLaiTietKiem() {
  const [mode, setMode] = useState<"theo-ngan-hang" | "tu-nhap">("theo-ngan-hang");

  // Input States
  const [soTienGoc, setSoTienGoc] = useState<number>(100000000);
  const [selectedBankId, setSelectedBankId] = useState<string>("vietcombank");
  const [channel, setChannel] = useState<"online" | "counter">("online");
  const [kyHanThang, setKyHanThang] = useState<number>(12);
  const [customRate, setCustomRate] = useState<number>(5.5);
  const [depositDateStr, setDepositDateStr] = useState<string>(formatDateISO(new Date()));
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(5000000);

  const selectedBank = useMemo(() => {
    return MASTER_BANKS.find((b) => b.id === selectedBankId) || MASTER_BANKS[0];
  }, [selectedBankId]);

  // Tìm lãi suất tương ứng từ DB / Baseline
  const matchedRateInfo = useMemo(() => {
    const rate = BASELINE_RATES.find(
      (r) =>
        r.bank_id === selectedBankId &&
        r.channel === channel &&
        r.term_value === kyHanThang &&
        r.term_unit === "month"
    );
    return rate || null;
  }, [selectedBankId, channel, kyHanThang]);

  const activeRate = useMemo(() => {
    if (mode === "theo-ngan-hang") {
      return matchedRateInfo ? matchedRateInfo.interest_rate : customRate;
    }
    return customRate;
  }, [mode, matchedRateInfo, customRate]);

  // Tính toán kết quả
  const calculationResult = useMemo(() => {
    const startDate = new Date(depositDateStr);
    const validStartDate = isNaN(startDate.getTime()) ? new Date() : startDate;

    if (isRecurring) {
      return {
        type: "recurring" as const,
        data: calculateRecurringSavings(soTienGoc, monthlyContribution, activeRate, kyHanThang),
        maturityDate: getMaturityDate(validStartDate, kyHanThang),
      };
    }

    return {
      type: "fixed" as const,
      data: calculateFixedTermDeposit(soTienGoc, activeRate, kyHanThang, validStartDate),
    };
  }, [soTienGoc, activeRate, kyHanThang, depositDateStr, isRecurring, monthlyContribution]);

  const handleReset = () => {
    setSoTienGoc(100000000);
    setSelectedBankId("vietcombank");
    setChannel("online");
    setKyHanThang(12);
    setCustomRate(5.5);
    setDepositDateStr(formatDateISO(new Date()));
    setIsRecurring(false);
    setMonthlyContribution(5000000);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-5 space-y-6">
        {/* Mode Selector */}
        <div className="flex rounded-xl bg-muted p-1 border border-border">
          <button
            type="button"
            onClick={() => setMode("theo-ngan-hang")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              mode === "theo-ngan-hang"
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Landmark className="h-4 w-4" />
            Theo ngân hàng
          </button>
          <button
            type="button"
            onClick={() => setMode("tu-nhap")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              mode === "tu-nhap"
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calculator className="h-4 w-4" />
            Tự nhập lãi suất
          </button>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Thông số tính toán
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Đặt lại
            </button>
          </div>

          {/* Số tiền gửi */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Số tiền gửi ban đầu (VND)
            </label>
            <input
              type="number"
              value={soTienGoc}
              onChange={(e) => setSoTienGoc(Number(e.target.value))}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
            />
            <div className="mt-1 text-xs text-muted-foreground">
              Bằng chữ: <span className="font-medium text-foreground">{dinhDangTien(soTienGoc)}</span>
            </div>
          </div>

          {mode === "theo-ngan-hang" ? (
            <>
              {/* Chọn ngân hàng */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Chọn ngân hàng
                </label>
                <select
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                >
                  {MASTER_BANKS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.short_name} - {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hình thức gửi */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Hình thức gửi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel("online")}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                      channel === "online"
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Gửi Online (Lãi cao hơn)
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel("counter")}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                      channel === "counter"
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Gửi tại quầy
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Tự nhập lãi suất */
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Lãi suất (%/năm)
              </label>
              <input
                type="number"
                step="0.05"
                value={customRate}
                onChange={(e) => setCustomRate(Number(e.target.value))}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
              />
            </div>
          )}

          {/* Kỳ hạn & Ngày gửi */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Kỳ hạn gửi
              </label>
              <select
                value={kyHanThang}
                onChange={(e) => setKyHanThang(Number(e.target.value))}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              >
                {[1, 2, 3, 6, 9, 12, 18, 24, 36].map((m) => (
                  <option key={m} value={m}>
                    {m} tháng
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Ngày bắt đầu gửi
              </label>
              <input
                type="date"
                value={depositDateStr}
                onChange={(e) => setDepositDateStr(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none"
              />
            </div>
          </div>

          {/* Tùy chọn gửi góp thêm */}
          <div className="pt-2 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-xs font-semibold text-foreground">
                Gửi thêm định kỳ hàng tháng (Tiết kiệm tích lũy)
              </span>
            </label>

            {isRecurring && (
              <div className="mt-3">
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Số tiền gửi thêm mỗi tháng (VND)
                </label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Source Verification Badge */}
        {mode === "theo-ngan-hang" && matchedRateInfo && (
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 space-y-1">
              <div className="font-semibold">
                Dữ liệu chính thức từ {selectedBank.short_name}: {dinhDangPhanTram(matchedRateInfo.interest_rate)}/năm
              </div>
              <div className="text-blue-700 flex items-center gap-2">
                <span>Xác minh: {matchedRateInfo.verified_at}</span>
                {matchedRateInfo.source_url && (
                  <a
                    href={matchedRateInfo.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold underline hover:text-blue-900"
                  >
                    Xem biểu lãi suất gốc
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Result Section */}
      <div className="lg:col-span-7 space-y-6">
        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm relative overflow-hidden">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-secondary" />
              Tổng tiền lãi thực nhận
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-secondary">
              {dinhDangTien(
                calculationResult.type === "fixed"
                  ? calculationResult.data.interest
                  : calculationResult.data.totalInterest
              )}
            </div>
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
              <span>Lãi suất áp dụng:</span>
              <span className="font-semibold text-foreground">{dinhDangPhanTram(activeRate)}</span>
              {calculationResult.type === "fixed" && (
                <span>({calculationResult.data.actualDays} ngày thực tế)</span>
              )}
            </div>
          </div>

          <div className="bg-primary rounded-2xl p-6 shadow-md text-primary-foreground relative overflow-hidden">
            <div className="text-xs text-primary-foreground/80 mb-1 flex items-center gap-1.5">
              <Wallet className="h-4 w-4" />
              Tổng tiền nhận khi đáo hạn
            </div>
            <div className="text-2xl lg:text-3xl font-bold">
              {dinhDangTien(
                calculationResult.type === "fixed"
                  ? calculationResult.data.totalMaturity
                  : calculationResult.data.totalMaturity
              )}
            </div>
            <div className="mt-2 text-xs text-primary-foreground/80 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Đáo hạn:</span>
              <span className="font-semibold">
                {formatDateISO(
                  calculationResult.type === "fixed"
                    ? calculationResult.data.maturityDate
                    : calculationResult.maturityDate
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Tiến trình tích lũy theo từng tháng</h3>
            <span className="text-xs text-muted-foreground">Kỳ hạn {kyHanThang} tháng</span>
          </div>
          <div className="overflow-x-auto max-h-[420px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card z-10">
                <tr className="bg-muted/60 border-b border-border text-xs text-muted-foreground">
                  <th className="px-5 py-3 text-center">Tháng</th>
                  <th className="px-5 py-3 text-right">Tiền lãi tháng</th>
                  <th className="px-5 py-3 text-right">Tổng lãi cộng dồn</th>
                  <th className="px-5 py-3 text-right">Số dư cuối kỳ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {calculationResult.data.monthlyBreakdown.map((row) => (
                  <tr key={row.month} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 text-center font-medium text-muted-foreground">
                      {row.month}
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-foreground">
                      {dinhDangTien(row.interestInMonth)}
                    </td>
                    <td className="px-5 py-3 text-right text-secondary font-medium">
                      {dinhDangTien(row.cumulativeInterest)}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-foreground">
                      {dinhDangTien(row.balance)}
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
            Tiền lãi được tính theo đúng chuẩn thông tư NHNN: <strong>Tiền lãi = Tiền gốc × Lãi suất/100 × Số ngày gửi thực tế / 365 ngày</strong>. Ngày đáo hạn được điều chỉnh chính xác theo lịch tháng và năm nhuận.
          </span>
        </div>
      </div>
    </div>
  );
}
