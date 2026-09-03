"use client";

import React, { useState } from "react";
import Image from "next/image";

interface BankLogoProps {
  bank?: {
    name?: string;
    short_name?: string;
    code?: string;
    slug?: string;
    logo?: string;
  } | null;
  width?: number;
  height?: number;
  size?: number; // Tương thích ngược: nếu truyền size, width = size * 2.2, height = size
  className?: string;
}

export function BankLogo({ bank, width, height, size, className = "" }: BankLogoProps) {
  const [hasError, setHasError] = useState(false);

  // Tính toán kích thước chuẩn theo tỷ lệ logo ngân hàng (thường ngang ~2.4 : 1)
  const actualHeight = height || (size ? size : 38);
  const actualWidth = width || (size ? Math.round(size * 2.2) : 88);

  if (!bank) {
    return (
      <div
        style={{ width: actualWidth, height: actualHeight }}
        className={`rounded-lg bg-muted border border-border flex items-center justify-center shrink-0 ${className}`}
      >
        <span className="text-xs font-bold text-muted-foreground">NH</span>
      </div>
    );
  }

  const logoSrc = `/logo/${bank.slug || bank.code?.toLowerCase()}.png`;
  const initials = bank.code || bank.short_name?.substring(0, 3).toUpperCase() || "NH";

  if (hasError) {
    return (
      <div
        style={{ width: actualWidth, height: actualHeight }}
        className={`rounded-lg bg-white border border-border shadow-xs flex items-center justify-center font-bold text-xs text-primary shrink-0 select-none ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      style={{ width: actualWidth, height: actualHeight }}
      className={`rounded-lg bg-white border border-border/80 px-1.5 py-0.5 shadow-xs flex items-center justify-center shrink-0 overflow-hidden ${className}`}
    >
      <Image
        src={logoSrc}
        alt={`Logo ${bank.short_name || bank.name || "Ngân hàng"}`}
        width={actualWidth * 2}
        height={actualHeight * 2}
        className="w-full h-full object-contain"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
