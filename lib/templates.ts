export type TemplateContext = {
  customer_name?: string | null;
  service_type?: string | null;
  job_title?: string | null;
  company_name?: string | null;
  owner_name?: string | null;
};

export const SUPPORTED_PLACEHOLDERS = [
  "customer_name",
  "service_type",
  "job_title",
  "company_name",
  "owner_name",
] as const;

/**
 * Replace {{placeholder}} occurrences with values from context.
 * Unknown placeholders are left untouched.
 */
export function renderTemplate(body: string, ctx: TemplateContext): string {
  return body.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (match, key: string) => {
    const k = key.trim().toLowerCase() as keyof TemplateContext;
    const val = ctx[k];
    if (val === undefined || val === null || val === "") return match;
    return String(val);
  });
}
