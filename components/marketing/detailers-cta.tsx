"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getStoredUtm, trackEvent } from "@/lib/analytics";
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type Variant = VariantProps<typeof buttonVariants>["variant"];
type Size = VariantProps<typeof buttonVariants>["size"];

interface Props {
  href: "/register" | "/pricing";
  cta: "start_free" | "view_pricing";
  eventName: string;
  label: string;
  variant?: Variant;
  size?: Size;
}

export function DetailersCtaLink({ href, cta, eventName, label, variant, size = "lg" }: Props) {
  const router = useRouter();

  function handleClick() {
    const utm = getStoredUtm();

    trackEvent(eventName, {
      path: "/for/auto-detailers",
      cta,
      destination: href,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
    });

    const params = new URLSearchParams({ source_page: "for-auto-detailers" });
    if (utm.utm_source) params.set("utm_source", utm.utm_source);
    if (utm.utm_medium) params.set("utm_medium", utm.utm_medium);
    if (utm.utm_campaign) params.set("utm_campaign", utm.utm_campaign);
    if (utm.utm_content) params.set("utm_content", utm.utm_content);
    if (utm.utm_term) params.set("utm_term", utm.utm_term);

    router.push(`${href}?${params.toString()}`);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(buttonVariants({ variant, size }))}
    >
      {label}
    </button>
  );
}
