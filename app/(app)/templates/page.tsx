import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getLocale, getDictionary } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateEditor } from "@/components/templates/template-editor";
import { DEFAULT_TEMPLATES } from "@/emails/defaults";
import type { TaskType } from "@prisma/client";

const EDITABLE_TYPES: TaskType[] = [
  "QUOTE_FOLLOW_UP",
  "CONFIRMATION",
  "REVIEW_REQUEST",
  "REACTIVATION",
];

export default async function TemplatesPage() {
  const user = await requireUser();
  const t = getDictionary(getLocale());
  const tpl = t.templates;
  const TYPE_LABELS: Record<TaskType, string> = {
    QUOTE_FOLLOW_UP: tpl.quoteFollowUp,
    CONFIRMATION: tpl.confirmation,
    REVIEW_REQUEST: tpl.reviewRequest,
    REACTIVATION: tpl.reactivation,
    MANUAL: tpl.manual,
  };
  const templates = await prisma.messageTemplate.findMany({
    where: { userId: user.id },
  });

  const byType = new Map(templates.map((t) => [t.type, t]));

  return (
    <div className="space-y-6">
      <PageHeader
        title={tpl.title}
        description={tpl.desc}
      />
      <div className="space-y-6">
        {EDITABLE_TYPES.map((type) => {
          const existing = byType.get(type);
          const fallback = DEFAULT_TEMPLATES.find((d) => d.type === type)!;
          const t = existing ?? {
            type,
            name: fallback.name,
            subject: fallback.subject,
            body: fallback.body,
            isDefault: true,
          };
          return (
            <Card key={type}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>{TYPE_LABELS[type]}</CardTitle>
                {existing && !existing.isDefault ? (
                  <Badge variant="secondary">{tpl.customized}</Badge>
                ) : (
                  <Badge variant="muted">{tpl.default}</Badge>
                )}
              </CardHeader>
              <CardContent>
                <TemplateEditor
                  type={t.type}
                  name={t.name}
                  subject={t.subject}
                  body={t.body}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
