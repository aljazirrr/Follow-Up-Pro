import Link from "next/link";
import { Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getLocale, getDictionary } from "@/lib/i18n";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocale();
  const t = getDictionary(locale);
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" />
            </div>
            Rebooker
          </Link>
          <nav className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              href="/pricing"
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              {t.nav.pricing}
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              {t.nav.signIn}
            </Link>
            <Link href="/register" className={buttonVariants({ size: "sm" })}>
              {t.nav.startFree}
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-muted/20">
        <div className="container flex flex-col items-center justify-between gap-2 py-8 text-sm text-muted-foreground sm:flex-row">
          <p>{t.marketing.footer.replace("{year}", String(new Date().getFullYear()))}</p>
          <div className="flex gap-4">
            <Link href="/pricing" className="hover:text-foreground">
              {t.nav.pricing}
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              {t.nav.privacy}
            </Link>
            <Link href="/login" className="hover:text-foreground">
              {t.nav.signIn}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
