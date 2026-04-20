import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocale, getDictionary } from "@/lib/i18n";

export default function PricingPage() {
  const locale = getLocale();
  const t = getDictionary(locale).pricing;
  return (
    <div className="container py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.sub}</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t.free}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-semibold">
              $0 <span className="text-sm font-normal text-muted-foreground">{t.perMonth}</span>
            </div>
            <ul className="space-y-2 text-sm">
              {t.freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className={buttonVariants({ variant: "outline", size: "default" })}>
              {t.startFree}
            </Link>
          </CardContent>
        </Card>

        <Card className="border-primary/40">
          <CardHeader>
            <CardTitle>{t.pro}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-semibold">
              $19 <span className="text-sm font-normal text-muted-foreground">{t.perMonth}</span>
            </div>
            <ul className="space-y-2 text-sm">
              {t.proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className={buttonVariants({ size: "default" })}>
              {t.startFreeUpgrade}
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
