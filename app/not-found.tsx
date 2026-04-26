import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/i18n";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  const t = getDictionary(getLocale());
  const e = t.errors;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="space-y-2">
        <p className="text-5xl font-bold text-muted-foreground">404</p>
        <h1 className="text-xl font-semibold">{e.notFoundTitle}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{e.notFoundBody}</p>
      </div>
      <Link href="/" className={buttonVariants({})}>
        {e.goHome}
      </Link>
    </div>
  );
}
