"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";
import { useTranslation } from "@/lib/i18n/client";

export function Topbar({ email }: { email: string }) {
  const { t } = useTranslation();
  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4 md:px-6">
      <div className="text-sm text-muted-foreground">{t.topbar.signedInAs} {email}</div>
      <div className="flex items-center gap-2">
        <Link
          href="/contacts/new"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Plus className="h-4 w-4" /> {t.nav.newContact}
        </Link>
        <Button size="sm" variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
          <LogOut className="h-4 w-4" />
          {t.nav.signOut}
        </Button>
      </div>
    </header>
  );
}
