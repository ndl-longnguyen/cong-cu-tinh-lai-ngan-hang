"use client";

import { useEffect, useRef } from "react";

type AdSize = "banner" | "rectangle" | "leaderboard" | "skyscraper" | "responsive";

interface QuangCaoAdsenseProps {
  slot: string;
  size?: AdSize;
  className?: string;
}

const sizeConfig: Record<AdSize, { width: number; height: number } | "responsive"> = {
  banner: { width: 468, height: 60 },
  rectangle: { width: 300, height: 250 },
  leaderboard: { width: 728, height: 90 },
  skyscraper: { width: 160, height: 600 },
  responsive: "responsive",
};

export function QuangCaoAdsense({
  slot,
  size = "responsive",
  className = "",
}: QuangCaoAdsenseProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    // Chỉ load ads một lần
    if (isAdLoaded.current) return;

    try {
      // Kiểm tra xem Google AdSense đã load chưa
      if (typeof window !== "undefined" && (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle) {
        ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle).push({});
        isAdLoaded.current = true;
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  const config = sizeConfig[size];
  const isResponsive = config === "responsive";

  return (
    <div
      ref={adRef}
      className={`ad-container overflow-hidden ${className}`}
      style={
        isResponsive
          ? { minHeight: 100 }
          : { width: config.width, height: config.height }
      }
    >
      {/* Placeholder for development */}
      <div
        className={`
          flex items-center justify-center bg-muted/50 border border-dashed border-border rounded-lg text-muted-foreground text-sm
          ${isResponsive ? "w-full h-24 md:h-[90px]" : "w-full h-full"}
        `}
      >
        <span>Quảng cáo ({slot})</span>
      </div>

      {/* Actual AdSense code - uncomment in production
      <ins
        className="adsbygoogle"
        style={
          isResponsive
            ? { display: "block" }
            : { display: "inline-block", width: config.width, height: config.height }
        }
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Thay bằng publisher ID thực
        data-ad-slot={slot}
        {...(isResponsive && { "data-ad-format": "auto", "data-full-width-responsive": "true" })}
      />
      */}
    </div>
  );
}

// Component wrapper cho ad ở giữa content
export function QuangCaoTrongNoiDung({ slot }: { slot: string }) {
  return (
    <div className="my-8 flex justify-center">
      <QuangCaoAdsense slot={slot} size="responsive" className="max-w-3xl w-full" />
    </div>
  );
}

// Component wrapper cho ad ở sidebar
export function QuangCaoSidebar({ slot }: { slot: string }) {
  return (
    <div className="sticky top-20">
      <QuangCaoAdsense slot={slot} size="rectangle" />
    </div>
  );
}
