"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, BarChart3, RotateCcw, Info, Coins } from "lucide-react";
import { tinhLaiKep } from "@/lib/tinh-lai";
import { dinhDangTien } from "@/lib/dinh-dang";
import type { KetQuaLaiKep } from "@/types";

export function TinhLaiKep() {
  const [soTienGoc, setSoTienGoc] = useState<number>(100000000);
  const [laiSuat, setLaiSuat] = useState<number>(7);
  const [soNam, setSoNam] = useState<number>(10);
  const [tanSuat, setTanSuat] = useState<"hang-thang" | "hang-quy" | "hang-nam">("hang-nam");
  const [ketQua, setKetQua] = useState<KetQuaLaiKep | null>(null);

  useEffect(() => {
    const res = tinhLaiKep(soTienGoc, laiSuat, soNam, tanSuat);
    setKetQua(res);
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
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
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
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
              />
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
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Thời gian (năm)
                </label>
                <input
                  type="number"
                  value={soNam}
                  onChange={(e) => setSoNam(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                Tần suất ghép lãi
                <span title="Lãi sẽ được cộng vào gốc để tính lãi tiếp theo sau mỗi khoảng thời gian này">
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </span>
              </label>
              <select
                value={tanSuat}
                onChange={(e) => setTanSuat(e.target.value as any)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              >
                <option value="hang-nam">Hàng năm</option>
                <option value="hang-quy">Hàng quý</option>
                <option value="hang-thang">Hàng tháng</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-secondary/5 rounded-xl p-5 border border-secondary/10">
          <h4 className="font-semibold text-secondary mb-2 flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Sức mạnh của lãi kép
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Albert Einstein từng gọi lãi kép là "kỳ quan thứ 8 của thế giới". 
            Bằng cách tái đầu tư tiền lãi, tài sản của bạn sẽ tăng trưởng theo cấp số nhân thay vì cấp số cộng.
          </p>
        </div>
      </div>

      {/* Result Section */}
      <div className="lg:col-span-7 space-y-6">
        {ketQua && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm relative overflow-hidden">
                <div className="text-sm text-muted-foreground mb-1">Tổng tiền lãi (Lãi kép)</div>
                <div className="text-2xl font-bold text-secondary">
                  {dinhDangTien(ketQua.tongTienLaiKep)}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Nhiều hơn lãi đơn: <span className="text-secondary font-medium">+{dinhDangTien(ketQua.chenhLech)}</span>
                </div>
              </div>
              <div className="bg-primary rounded-2xl p-6 shadow-md text-primary-foreground relative overflow-hidden">
                <div className="text-sm text-primary-foreground/80 mb-1">Tổng giá trị sau {soNam} năm</div>
                <div className="text-2xl font-bold">
                  {dinhDangTien(ketQua.tongTienNhanLaiKep)}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Sự tăng trưởng qua từng năm</h3>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-6 py-3 border-b border-border text-center">Năm</th>
                      <th className="px-6 py-3 border-b border-border">Giá trị lãi kép</th>
                      <th className="px-6 py-3 border-b border-border">Giá trị lãi đơn</th>
                      <th className="px-6 py-3 border-b border-border text-right">Chênh lệch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {ketQua.chiTietTheoNam.map((item) => (
                      <tr key={item.nam} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-3 text-center font-medium">{item.nam}</td>
                        <td className="px-6 py-3 font-semibold text-secondary">
                          {dinhDangTien(item.soDuLaiKep)}
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {dinhDangTien(item.soDuLaiDon)}
                        </td>
                        <td className="px-6 py-3 text-right text-secondary">
                          +{dinhDangTien(item.chenhLech)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
