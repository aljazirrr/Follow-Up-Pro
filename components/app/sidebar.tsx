"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ListChecks,
  Mail,
  CreditCard,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/client";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const nav = [
    { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/contacts", label: t.nav.contacts, icon: Users },
    { href: "/jobs", label: t.nav.jobs, icon: Briefcase },
    { href: "/followups", label: t.nav.followups, icon: ListChecks },
    { href: "/templates", label: t.nav.templates, icon: Mail },
    { href: "/billing", label: t.nav.billing, icon: CreditCard },
    { href: "/settings", label: t.nav.settings, icon: Settings },
  ];

  return (
    <aside className="hidden w-60 shrink-0 border-r bg-card md:block">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Zap className="h-4 w-4" />
        </div>
        <div className="font-semibold tracking-tight">Rebooker</div>
      </div>
      <nav className="flex flex-col gap-0.5 p-3">
        {nav.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <LanguageSwitcher />
      </div>
    </aside>
  );
}
