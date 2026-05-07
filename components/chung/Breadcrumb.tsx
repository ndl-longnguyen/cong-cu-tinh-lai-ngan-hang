import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { JsonLd, taoSchemaBreadcrumb } from "@/lib/schema-structured-data";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const allItems = [{ name: "Trang chủ", href: "/" }, ...items];

  return (
    <>
      <JsonLd data={taoSchemaBreadcrumb(allItems)} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center flex-wrap gap-1.5 text-sm">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;

            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {index === 0 ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Home className="h-4 w-4" />
                    <span className="sr-only">{item.name}</span>
                  </Link>
                ) : isLast ? (
                  <span className="font-medium text-foreground" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
                {!isLast && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
