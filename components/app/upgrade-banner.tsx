import Link from "next/link";
import { Sparkles } from "lucide-react";

export function UpgradeBanner({ plan }: { plan: "FREE" | "PRO" }) {
  if (plan === "PRO") return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-accent/40 px-4 py-2 text-sm md:px-6">
      <div className="flex items-center gap-2 text-accent-foreground">
        <Sparkles className="h-4 w-4" />
        You're on the Free plan — limited to 20 contacts and 20 tasks/month.
      </div>
      <Link
        href="/billing"
        className="font-medium text-primary underline-offset-4 hover:underline"
      >
        Upgrade to Pro →
      </Link>
    </div>
  );
}
