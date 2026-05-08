"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, History, RotateCcw, Info, Landmark } from "lucide-react";
import { tinhVayDuNoGiamDan, tinhVayTraGocDeu } from "@/lib/tinh-lai";
import { dinhDangTien } from "@/lib/dinh-dang";
import type { KetQuaTinhVay } from "@/types";

export function TinhVay() {
  const [soTienVay, setSoTienVay] = useState<number>(500000000);
  const [laiSuat, setLaiSuat] = useState<number>(10.5);
  const [kyHan, setKyHan] = useState<number>(60);
  const [hinhThuc, setHinhThuc] = useState<"du-no-giam-dan" | "tra-goc-deu">("du-no-giam-dan");
  const [ketQua, setKetQua] = useState<KetQuaTinhVay | null>(null);

  useEffect(() => {
    const res = hinhThuc === "du-no-giam-dan" 
      ? tinhVayDuNoGiamDan(soTienVay, laiSuat, kyHan)
      : tinhVayTraGocDeu(soTienVay, laiSuat, kyHan);
    setKetQua(res);
  }, [soTienVay, laiSuat, kyHan, hinhThuc]);

  const handleReset = () => {
    setSoTienVay(500000000);
    setLaiSuat(10.5);
    setKyHan(60);
    setHinhThuc("du-no-giam-dan");
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              Thông tin khoản vay
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
                Số tiền vay (VND)
              </label>
              <input
                type="number"
                value={soTienVay}
                onChange={(e) => setSoTienVay(Number(e.target.value))}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Lãi suất vay (%/năm)
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
                  Thời hạn vay (tháng)
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
                Phương thức trả nợ
                <span title="Dư nợ giảm dần: Tiền gốc cố định, tiền lãi giảm dần theo dư nợ thực tế. Trả góp đều: Tổng số tiền trả (gốc + lãi) cố định mỗi tháng.">
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
                <button
                  onClick={() => setHinhThuc("du-no-giam-dan")}
                  className={`px-3 py-2 text-xs font-medium rounded-md transition-all ${
                    hinhThuc === "du-no-giam-dan" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Dư nợ giảm dần
                </button>
                <button
                  onClick={() => setHinhThuc("tra-goc-deu")}
                  className={`px-3 py-2 text-xs font-medium rounded-md transition-all ${
                    hinhThuc === "tra-goc-deu" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Trả góp đều (PMT)
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
          <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Lưu ý khoản vay
          </h4>
          <ul className="text-xs text-amber-700 space-y-2">
            <li>• Lãi suất vay thực tế có thể cao hơn lãi suất ưu đãi công bố sau thời gian khuyến mãi.</li>
            <li>• Phí bảo hiểm khoản vay (nếu có) thường từ 3-5% giá trị khoản vay.</li>
            <li>• Phí trả nợ trước hạn thường áp dụng từ 1-3% dư nợ còn lại.</li>
          </ul>
        </div>
      </div>

      {/* Result Section */}
      <div className="lg:col-span-7 space-y-6">
        {ketQua && (
          <>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                <div className="text-xs text-muted-foreground mb-1">Trả tháng đầu/đều</div>
                <div className="text-lg font-bold text-primary">
                  {dinhDangTien(ketQua.bangAmortization[0].tongTra)}
                </div>
              </div>
              <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                <div className="text-xs text-muted-foreground mb-1">Tổng lãi phải trả</div>
                <div className="text-lg font-bold text-destructive">
                  {dinhDangTien(ketQua.tongTienLai)}
                </div>
              </div>
              <div className="bg-primary rounded-2xl p-5 shadow-md text-primary-foreground">
                <div className="text-xs text-primary-foreground/80 mb-1">Tổng tiền gốc + lãi</div>
                <div className="text-lg font-bold">
                  {dinhDangTien(ketQua.tongTienTra)}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Lịch trả nợ chi tiết</h3>
                <History className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="overflow-y-auto max-h-[500px]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="bg-muted/80 backdrop-blur-sm">
                      <th className="px-6 py-3 border-b border-border text-center">Kỳ</th>
                      <th className="px-6 py-3 border-b border-border">Gốc trả</th>
                      <th className="px-6 py-3 border-b border-border">Lãi trả</th>
                      <th className="px-6 py-3 border-b border-border">Tổng trả</th>
                      <th className="px-6 py-3 border-b border-border text-right">Dư nợ còn lại</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {ketQua.bangAmortization.map((item) => (
                      <tr key={item.ky} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-3 text-center font-medium">{item.ky}</td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {dinhDangTien(item.tienGoc)}
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {dinhDangTien(item.tienLai)}
                        </td>
                        <td className="px-6 py-3 font-medium text-foreground">
                          {dinhDangTien(item.tongTra)}
                        </td>
                        <td className="px-6 py-3 text-right text-muted-foreground">
                          {dinhDangTien(item.duNoConLai)}
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
