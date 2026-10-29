import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-muted-foreground my-3">
      <Link href="/" className="flex items-center hover:text-foreground transition-colors">
        <Home className="w-3.5 h-3.5 mr-1" />
        <span>Home</span>
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center">
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-muted-foreground/60" />
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-semibold truncate max-w-[200px] md:max-w-none">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

