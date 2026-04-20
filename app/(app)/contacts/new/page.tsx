import { getLocale, getDictionary } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/contacts/contact-form";

export default function NewContactPage() {
  const t = getDictionary(getLocale());
  return (
    <div className="space-y-6">
      <PageHeader
        title={t.contacts.newTitle}
        description={t.contacts.newDesc}
      />
      <Card>
        <CardContent className="pt-6">
          <ContactForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
