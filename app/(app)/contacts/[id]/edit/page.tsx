import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/contacts/contact-form";
import { DeleteContactButton } from "./delete-button";

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const contact = await prisma.contact.findFirst({
    where: { id, userId: user.id },
  });
  if (!contact) notFound();

  return (
    <div className="space-y-6">
      <Link
        href={`/contacts/${contact.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to contact
      </Link>

      <PageHeader
        title="Edit contact"
        description={contact.fullName}
        actions={<DeleteContactButton id={contact.id} />}
      />

      <Card>
        <CardContent className="pt-6">
          <ContactForm
            mode="edit"
            initial={{
              id: contact.id,
              fullName: contact.fullName,
              phone: contact.phone,
              email: contact.email,
              companyName: contact.companyName,
              serviceType: contact.serviceType,
              source: contact.source,
              notes: contact.notes,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
