"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Building2,
  Calculator,
  Menu,
  X,
  ChevronDown,
  TrendingUp,
  Percent,
  CreditCard,
  BookOpen,
} from "lucide-react";

const navigationItems = [
  { name: "Trang chủ", href: "/" },
  { name: "Lãi suất", href: "/lai-suat" },
  {
    name: "Công cụ",
    href: "#",
    children: [
      {
        name: "Tính lãi tiết kiệm",
        href: "/cong-cu/tinh-lai-tiet-kiem",
        icon: Percent,
        description: "Tính tiền lãi và tổng tiền nhận khi gửi tiết kiệm",
      },
      {
        name: "Tính lãi kép",
        href: "/cong-cu/tinh-lai-kep",
        icon: TrendingUp,
        description: "So sánh sức mạnh của lãi kép vs lãi đơn",
      },
      {
        name: "Tính khoản vay",
        href: "/cong-cu/tinh-vay",
        icon: CreditCard,
        description: "Tính tiền trả hàng tháng và lịch trả nợ",
      },
    ],
  },
  { name: "Blog", href: "/blog" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-border shadow-xs overflow-hidden group-hover:scale-105 transition-transform p-0.5">
              <Image
                src="/icon.png"
                alt="Logo Lãi Suất Ngân Hàng"
                width={40}
                height={40}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-foreground tracking-tight">Lãi Suất</span>
              <span className="text-lg font-bold text-primary tracking-tight"> Ngân Hàng</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative">
                {item.children ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted">
                      {item.name}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {openDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-1 w-72 rounded-lg border border-border bg-popover p-2 shadow-lg">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="flex items-start gap-3 rounded-md p-3 hover:bg-muted transition-colors"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                              <child.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {child.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {child.description}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/cong-cu/tinh-lai-tiet-kiem"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Calculator className="h-4 w-4" />
              Tính lãi ngay
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Mở menu</span>
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-sm font-medium text-foreground">
                      {item.name}
                    </div>
                    <div className="pl-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <child.icon className="h-4 w-4" />
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-border">
              <Link
                href="/cong-cu/tinh-lai-tiet-kiem"
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Calculator className="h-4 w-4" />
                Tính lãi ngay
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
