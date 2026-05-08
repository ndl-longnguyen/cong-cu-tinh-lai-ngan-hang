"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowUpDown, ExternalLink, Filter, TrendingUp } from "lucide-react";
import { layTatCaLaiSuat, layDanhSachNganHang } from "@/lib/lay-du-lieu";
import { dinhDangPhanTram } from "@/lib/dinh-dang";

export function BangLaiSuat() {
  const [timKiem, setTimKiem] = useState("");
  const [kyHanLoc, setKyHanLoc] = useState<number>(12);
  const [hinhThucLoc, setHinhThucLoc] = useState<"online" | "tai-quay">("online");
  const [sapXep, setSapXep] = useState<"cao-den-thap" | "thap-den-cao">("cao-den-thap");

  const laiSuat = useMemo(() => layTatCaLaiSuat(), []);
  const nganHang = useMemo(() => layDanhSachNganHang(), []);

  const duLieuHienThi = useMemo(() => {
    let result = laiSuat
      .filter((ls) => ls.kyHan === kyHanLoc && ls.hinhThuc === hinhThucLoc)
      .map((ls) => {
        const nh = nganHang.find((n) => n.id === ls.nganHangId);
        return { ...ls, nganHang: nh };
      })
      .filter((item) => 
        item.nganHang?.ten.toLowerCase().includes(timKiem.toLowerCase()) ||
        item.nganHang?.tenVietTat.toLowerCase().includes(timKiem.toLowerCase())
      );

    if (sapXep === "cao-den-thap") {
      result.sort((a, b) => b.laiSuat - a.laiSuat);
    } else {
      result.sort((a, b) => a.laiSuat - b.laiSuat);
    }

    return result;
  }, [laiSuat, nganHang, kyHanLoc, hinhThucLoc, timKiem, sapXep]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm tên ngân hàng..."
              value={timKiem}
              onChange={(e) => setTimKiem(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div>
            <select
              value={kyHanLoc}
              onChange={(e) => setKyHanLoc(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              {[1, 3, 6, 9, 12, 18, 24, 36].map((k) => (
                <option key={k} value={k}>Kỳ hạn {k} tháng</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={hinhThucLoc}
              onChange={(e) => setHinhThucLoc(e.target.value as any)}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              <option value="online">Gửi Online</option>
              <option value="tai-quay">Tại quầy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-6 py-4 border-b border-border text-left font-semibold">Ngân hàng</th>
                <th 
                  className="px-6 py-4 border-b border-border text-center font-semibold cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setSapXep(sapXep === "cao-den-thap" ? "thap-den-cao" : "cao-den-thap")}
                >
                  <div className="flex items-center justify-center gap-1">
                    Lãi suất
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-6 py-4 border-b border-border text-center font-semibold">Kỳ hạn</th>
                <th className="px-6 py-4 border-b border-border text-center font-semibold">Hình thức</th>
                <th className="px-6 py-4 border-b border-border text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {duLieuHienThi.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center font-bold text-xs text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {item.nganHang?.tenVietTat}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{item.nganHang?.ten}</div>
                        <div className="text-xs text-muted-foreground uppercase">{item.nganHang?.tenVietTat}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary font-bold text-base">
                      {dinhDangPhanTram(item.laiSuat)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-muted-foreground">
                    {item.kyHan} tháng
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded-md ${item.hinhThuc === 'online' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                      {item.hinhThuc === 'online' ? 'Online' : 'Tại quầy'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/ngan-hang/${item.nganHang?.slug}`}
                      className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                    >
                      Chi tiết
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {duLieuHienThi.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            Không tìm thấy dữ liệu phù hợp với bộ lọc.
          </div>
        )}
      </div>

      {/* Tip Section */}
      <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
        <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <span className="font-semibold text-primary">Mẹo:</span> Bạn nên ưu tiên gửi tiết kiệm Online để nhận mức lãi suất cao hơn từ 0.2% - 0.5% so với tại quầy. Lãi suất niêm yết có thể thay đổi tùy theo số tiền gửi thực tế.
        </div>
      </div>
    </div>
  );
}
