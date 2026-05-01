export type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

const SESSION_KEY = "rebooker:utm";
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export function parseUtmFromSearch(search: string): UtmParams {
  const params = new URLSearchParams(search);
  const utm: UtmParams = {};
  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) utm[key] = val;
  }
  return utm;
}

export function getStoredUtm(): UtmParams {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}

// Merges incoming UTMs into sessionStorage. Existing non-empty values are
// never overwritten by empty/missing incoming values.
export function persistUtm(incoming: UtmParams): void {
  try {
    const merged: UtmParams = { ...getStoredUtm() };
    for (const key of UTM_KEYS) {
      if (incoming[key]) merged[key] = incoming[key];
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(merged));
  } catch {}
}

// Fire-and-forget: sends event to /api/track. Undefined/empty props are omitted.
export function trackEvent(
  event: string,
  props: Record<string, string | undefined> = {}
): void {
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v) clean[k] = v;
  }
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, ...clean }),
    }).catch(() => {});
  } catch {}
}
