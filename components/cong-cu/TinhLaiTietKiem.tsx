"use client";

import React, { useState, useEffect } from "react";
import { Calculator, Info, RotateCcw, TrendingUp, Wallet } from "lucide-react";
import { tinhLaiTietKiem } from "@/lib/tinh-lai";
import { dinhDangTien, dinhDangPhanTram, dinhDangKyHan } from "@/lib/dinh-dang";
import type { KetQuaTinhLai } from "@/types";

export function TinhLaiTietKiem() {
  const [soTienGoc, setSoTienGoc] = useState<number>(100000000);
  const [laiSuat, setLaiSuat] = useState<number>(5.5);
  const [kyHan, setKyHan] = useState<number>(12);
  const [guiThem, setGuiThem] = useState<number>(0);
  const [ketQua, setKetQua] = useState<KetQuaTinhLai | null>(null);

  useEffect(() => {
    const res = tinhLaiTietKiem(soTienGoc, laiSuat, kyHan, guiThem);
    setKetQua(res);
  }, [soTienGoc, laiSuat, kyHan, guiThem]);

  const handleReset = () => {
    setSoTienGoc(100000000);
    setLaiSuat(5.5);
    setKyHan(12);
    setGuiThem(0);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Thông số tính toán
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
                Số tiền gửi (VND)
              </label>
              <input
                type="number"
                value={soTienGoc}
                onChange={(e) => setSoTienGoc(Number(e.target.value))}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <div className="mt-1.5 text-xs text-muted-foreground">
                {dinhDangTien(soTienGoc)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Lãi suất (%/năm)
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
                  Kỳ hạn (tháng)
                </label>
                <input
                  type="number"
                  value={kyHan}
                  onChange={(e) => setKyHan(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                Tiền gửi thêm hàng tháng (nếu có)
                <span title="Số tiền bạn gửi thêm vào mỗi tháng">
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </span>
              </label>
              <input
                type="number"
                value={guiThem}
                onChange={(e) => setGuiThem(Number(e.target.value))}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
          <p className="text-sm text-primary/80 leading-relaxed italic">
            * Kết quả chỉ mang tính chất tham khảo. Lãi suất thực tế có thể thay đổi tùy theo quy định của từng ngân hàng tại thời điểm gửi.
          </p>
        </div>
      </div>

      {/* Result Section */}
      <div className="lg:col-span-7 space-y-6">
        {ketQua && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-3 opacity-5">
                  <TrendingUp className="h-12 w-12" />
                </div>
                <div className="text-sm text-muted-foreground mb-1">Tổng tiền lãi</div>
                <div className="text-2xl font-bold text-secondary">
                  {dinhDangTien(ketQua.tongTienLai)}
                </div>
              </div>
              <div className="bg-primary rounded-2xl p-6 shadow-md text-primary-foreground overflow-hidden relative">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Wallet className="h-12 w-12" />
                </div>
                <div className="text-sm text-primary-foreground/80 mb-1">Tổng tiền nhận được</div>
                <div className="text-2xl font-bold">
                  {dinhDangTien(ketQua.tongTienNhan)}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <h3 className="font-semibold text-foreground">Bảng chi tiết hàng tháng</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-6 py-3 border-b border-border">Tháng</th>
                      <th className="px-6 py-3 border-b border-border">Tiền lãi tháng</th>
                      <th className="px-6 py-3 border-b border-border">Tổng lãi cộng dồn</th>
                      <th className="px-6 py-3 border-b border-border text-right">Số dư cuối kỳ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {ketQua.chiTietTheoThang.map((item) => (
                      <tr key={item.thang} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-3 font-medium">{item.thang}</td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {dinhDangTien(item.tienLai)}
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {dinhDangTien(item.tongLai)}
                        </td>
                        <td className="px-6 py-3 text-right font-medium text-foreground">
                          {dinhDangTien(item.soDu)}
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
