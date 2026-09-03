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
  size?: number;
  className?: string;
}

export function BankLogo({ bank, size = 40, className = "" }: BankLogoProps) {
  const [hasError, setHasError] = useState(false);

  if (!bank) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-xl bg-muted border border-border flex items-center justify-center shrink-0 ${className}`}
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
        style={{ width: size, height: size }}
        className={`rounded-xl bg-white border border-border shadow-2xs flex items-center justify-center font-bold text-xs text-primary shrink-0 select-none ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-xl bg-white border border-border/80 p-1 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden ${className}`}
    >
      <Image
        src={logoSrc}
        alt={`Logo ${bank.short_name || bank.name || "Ngân hàng"}`}
        width={size * 2}
        height={size * 2}
        className="max-h-full max-w-full object-contain"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
