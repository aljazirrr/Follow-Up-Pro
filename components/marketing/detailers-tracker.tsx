"use client";

import { useEffect } from "react";
import { parseUtmFromSearch, persistUtm, getStoredUtm, trackEvent } from "@/lib/analytics";

export function DetailersTracker() {
  useEffect(() => {
    const incoming = parseUtmFromSearch(window.location.search);
    persistUtm(incoming);
    const utm = getStoredUtm();
    trackEvent("landing_detailers_viewed", {
      path: window.location.pathname,
      referrer: document.referrer || undefined,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_content: utm.utm_content,
      utm_term: utm.utm_term,
    });
  }, []);

  return null;
}
