import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/contacts/contact-form";

export default function NewContactPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New contact"
        description="Add a lead or existing customer."
      />
      <Card>
        <CardContent className="pt-6">
          <ContactForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
