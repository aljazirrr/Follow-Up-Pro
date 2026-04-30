import { getLocale, getDictionary } from "@/lib/i18n";

export default function TosPage() {
  const t = getDictionary(getLocale()).tos;

  return (
    <div className="container max-w-3xl py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t.lastUpdated}</p>
      <p className="mt-6 text-sm leading-relaxed text-foreground">{t.intro}</p>

      <Section title={t.serviceTitle}>
        <p>{t.serviceText}</p>
      </Section>

      <Section title={t.billingTitle}>
        <p>{t.billingText}</p>
      </Section>

      <Section title={t.cancellationTitle}>
        <p>{t.cancellationText}</p>
      </Section>

      <Section title={t.refundTitle}>
        <p>{t.refundText}</p>
      </Section>

      <Section title={t.acceptableUseTitle}>
        <ul className="list-disc space-y-1.5 pl-5">
          {t.acceptableUseItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title={t.dataTitle}>
        <p>{t.dataText}</p>
      </Section>

      <Section title={t.betaTitle}>
        <p>{t.betaText}</p>
      </Section>

      <Section title={t.changesTitle}>
        <p>{t.changesText}</p>
      </Section>

      <Section title={t.contactTitle}>
        <p>{t.contactText}</p>
        <p className="mt-2 font-medium">{t.contactEmail}</p>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
