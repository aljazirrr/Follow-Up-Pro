"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ListChecks, Briefcase, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/client";

export function MobileNav({
  overdueCount = 0,
  todayCount = 0,
}: {
  overdueCount?: number;
  todayCount?: number;
}) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const items = [
    { href: "/dashboard", icon: LayoutDashboard, label: t.nav.dashboard },
    { href: "/contacts", icon: Users, label: t.nav.contacts },
    { href: "/followups", icon: ListChecks, label: t.nav.followups },
    { href: "/jobs", icon: Briefcase, label: t.nav.jobs },
    { href: "/settings", icon: Settings, label: t.nav.settings },
  ];

  const badge =
    overdueCount > 0
      ? { count: overdueCount, className: "bg-destructive text-destructive-foreground" }
      : todayCount > 0
        ? { count: todayCount, className: "bg-muted text-muted-foreground" }
        : null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t bg-card md:hidden">
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        const isFollowups = href === "/followups";
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div className="relative">
              <Icon className="h-5 w-5" />
              {isFollowups && badge && (
                <span
                  className={cn(
                    "absolute -right-2 -top-1.5 rounded-full px-1 py-0.5 text-[9px] font-semibold leading-none",
                    badge.className
                  )}
                >
                  {badge.count > 99 ? "99+" : badge.count}
                </span>
              )}
            </div>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
