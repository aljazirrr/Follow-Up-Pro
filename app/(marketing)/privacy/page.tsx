import { getLocale, getDictionary } from "@/lib/i18n";

export default function PrivacyPage() {
  const t = getDictionary(getLocale()).privacy;

  return (
    <div className="container max-w-3xl py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t.lastUpdated}</p>
      <p className="mt-6 text-sm leading-relaxed text-foreground">{t.intro}</p>

      <Section title={t.controllerTitle}>
        <p>{t.controllerText}</p>
        <p className="mt-2 font-medium">{t.controllerEmail}</p>
      </Section>

      <Section title={t.whatTitle}>
        <ul className="list-disc space-y-1.5 pl-5">
          {t.whatItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title={t.whyTitle}>
        <ul className="list-disc space-y-1.5 pl-5">
          {t.whyItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title={t.legalTitle}>
        <p>{t.legalText}</p>
      </Section>

      <Section title={t.processorTitle}>
        <p>{t.processorText}</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          {t.processors.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title={t.retentionTitle}>
        <p>{t.retentionText}</p>
      </Section>

      <Section title={t.rightsTitle}>
        <p>{t.rightsText}</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          {t.rightsItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-3">{t.rightsContact}</p>
      </Section>

      <Section title={t.cookiesTitle}>
        <p>{t.cookiesText}</p>
      </Section>

      <Section title={t.changesTitle}>
        <p>{t.changesText}</p>
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
