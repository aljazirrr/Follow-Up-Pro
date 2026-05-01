import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function KPIStatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  href,
}: {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  tone?: "default" | "warning" | "success" | "destructive";
  href?: string;
}) {
  const toneClass = {
    default: "text-muted-foreground",
    warning: "text-warning",
    success: "text-success",
    destructive: "text-destructive",
  }[tone];

  const card = (
    <Card className={href ? "transition-colors hover:bg-muted/50" : undefined}>
      <CardContent className="flex items-center justify-between pt-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
        {Icon ? <Icon className={cn("h-5 w-5", toneClass)} /> : null}
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href} className="block">{card}</Link>;
  }

  return card;
}
