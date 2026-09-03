"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, BarChart3, RotateCcw, Info, Coins, CheckCircle2 } from "lucide-react";
import { calculateCompoundInterest } from "@/lib/finance/compound";
import { dinhDangTien } from "@/lib/dinh-dang";

export function TinhLaiKep() {
  const [soTienGoc, setSoTienGoc] = useState<number>(100000000);
  const [laiSuat, setLaiSuat] = useState<number>(7);
  const [soNam, setSoNam] = useState<number>(10);
  const [tanSuat, setTanSuat] = useState<"hang-thang" | "hang-quy" | "hang-nam">("hang-nam");

  const ketQua = useMemo(() => {
    return calculateCompoundInterest(soTienGoc, laiSuat, soNam, tanSuat);
  }, [soTienGoc, laiSuat, soNam, tanSuat]);

  const handleReset = () => {
    setSoTienGoc(100000000);
    setLaiSuat(7);
    setSoNam(10);
    setTanSuat("hang-nam");
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Thông số đầu tư
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Đặt lại
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Vốn đầu tư ban đầu (VND)
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Lãi suất kỳ vọng (%/năm)
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
                  Thời gian (năm)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={soNam}
                  onChange={(e) => setSoNam(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                Tần suất ghép lãi
                <span title="Lãi sinh ra sẽ được tự động cộng vào gốc để tính lãi cho chu kỳ tiếp theo">
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </span>
              </label>
              <select
                value={tanSuat}
                onChange={(e) => setTanSuat(e.target.value as any)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              >
                <option value="hang-nam">Hàng năm (1 lần/năm)</option>
                <option value="hang-quy">Hàng quý (4 lần/năm)</option>
                <option value="hang-thang">Hàng tháng (12 lần/năm)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Nguyên lý Lãi Kép Factual Box */}
        <div className="bg-secondary/5 rounded-2xl p-5 border border-secondary/15 space-y-2">
          <h4 className="font-semibold text-secondary flex items-center gap-2 text-sm">
            <Coins className="h-4 w-4" />
            Bản chất tài chính của lãi kép
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Lãi kép cho phép phần lợi nhuận đã tích lũy tiếp tục tạo ra lợi nhuận mới trong các kỳ sau. Càng duy trì kỷ luật đầu tư lâu dài, tài sản càng tăng trưởng theo cấp số nhân.
          </p>
        </div>
      </div>

      {/* Result Section */}
      <div className="lg:col-span-7 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm relative overflow-hidden">
            <div className="text-xs text-muted-foreground mb-1">Tổng tiền lãi tích lũy (Lãi kép)</div>
            <div className="text-2xl lg:text-3xl font-bold text-secondary">
              {dinhDangTien(ketQua.compoundInterestTotal)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Vượt trội hơn lãi đơn:{" "}
              <span className="text-secondary font-bold">+{dinhDangTien(ketQua.difference)}</span>
            </div>
          </div>
          <div className="bg-primary rounded-2xl p-6 shadow-md text-primary-foreground relative overflow-hidden">
            <div className="text-xs text-primary-foreground/80 mb-1">
              Tổng giá trị tài sản sau {soNam} năm
            </div>
            <div className="text-2xl lg:text-3xl font-bold">
              {dinhDangTien(ketQua.compoundTotalMaturity)}
            </div>
            <div className="mt-2 text-xs text-primary-foreground/80">
              Gốc ban đầu: {dinhDangTien(soTienGoc)}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Bảng tăng trưởng đối chứng từng năm</h3>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="overflow-x-auto max-h-[420px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card z-10">
                <tr className="bg-muted/60 border-b border-border text-xs text-muted-foreground">
                  <th className="px-5 py-3 text-center">Năm</th>
                  <th className="px-5 py-3 text-right">Giá trị Lãi Kép</th>
                  <th className="px-5 py-3 text-right">Giá trị Lãi Đơn</th>
                  <th className="px-5 py-3 text-right">Chênh lệch thặng dư</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ketQua.yearlyBreakdown.map((item) => (
                  <tr key={item.year} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 text-center font-medium text-muted-foreground">
                      Năm {item.year}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-secondary">
                      {dinhDangTien(item.compoundBalance)}
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground">
                      {dinhDangTien(item.simpleBalance)}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-secondary">
                      +{dinhDangTien(item.difference)}
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
            Công thức áp dụng: <strong>A = P × (1 + r/n)^(n×t)</strong>. Kết quả mô phỏng giả định toàn bộ tiền lãi được tái đầu tư liên tục với mức sinh lời cố định qua các năm.
          </span>
        </div>
      </div>
    </div>
  );
}
