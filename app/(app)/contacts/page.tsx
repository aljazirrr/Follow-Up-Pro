import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getLocale, getDictionary } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { ContactStatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import { ContactStatus, LeadSource, Prisma } from "@prisma/client";

type SearchParams = {
  q?: string;
  source?: string;
  status?: string;
};

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  const t = getDictionary(getLocale());
  const c = t.contacts;

  const q = params.q?.trim();
  const source = params.source;
  const statusFilter = params.status;

  const where: Prisma.ContactWhereInput = { userId: user.id };
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { companyName: { contains: q, mode: "insensitive" } },
    ];
  }
  if (source && Object.values(LeadSource).includes(source as LeadSource)) {
    where.source = source as LeadSource;
  }
  if (statusFilter && Object.values(ContactStatus).includes(statusFilter as ContactStatus)) {
    where.status = statusFilter as ContactStatus;
  }

  const contacts = await prisma.contact.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      _count: { select: { jobs: true, tasks: true } },
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={c.title}
        description={c.desc}
        actions={
          <Link
            href="/contacts/new"
            className={buttonVariants({ size: "sm" })}
          >
            <Plus className="h-4 w-4" /> {c.newContact}
          </Link>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <form
            method="get"
            className="mb-4 grid gap-3 sm:grid-cols-[1fr_160px_160px_auto]"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                placeholder={c.searchPlaceholder}
                defaultValue={q ?? ""}
                className="pl-8"
              />
            </div>
            <Select name="source" defaultValue={source ?? ""}>
              <option value="">{c.allSources}</option>
              {Object.values(LeadSource).map((s) => (
                <option key={s} value={s}>
                  {t.source[s]}
                </option>
              ))}
            </Select>
            <Select name="status" defaultValue={statusFilter ?? ""}>
              <option value="">{c.allStatuses}</option>
              {Object.values(ContactStatus).map((s) => (
                <option key={s} value={s}>
                  {t.contactStatus[s]}
                </option>
              ))}
            </Select>
            <button
              className={buttonVariants({ variant: "outline", size: "default" })}
              type="submit"
            >
              {c.apply}
            </button>
          </form>

          {contacts.length === 0 ? (
            <EmptyState
              title={q || source || statusFilter ? c.noMatchTitle : c.noContactsTitle}
              description={q || source || statusFilter ? c.noMatchDesc : c.noContactsDesc}
              action={
                <Link
                  href="/contacts/new"
                  className={buttonVariants({ size: "sm" })}
                >
                  <Plus className="h-4 w-4" /> {c.addContact}
                </Link>
              }
            />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>{c.colName}</TH>
                  <TH>{c.colService}</TH>
                  <TH>{c.colStatus}</TH>
                  <TH>{c.colSource}</TH>
                  <TH>{c.colJobs}</TH>
                  <TH>{c.colTasks}</TH>
                  <TH>{c.colCreated}</TH>
                </TR>
              </THead>
              <TBody>
                {contacts.map((contact) => (
                  <TR key={contact.id}>
                    <TD>
                      <Link
                        href={`/contacts/${contact.id}`}
                        className="font-medium hover:underline"
                      >
                        {contact.fullName}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {contact.email || contact.phone || "—"}
                      </div>
                    </TD>
                    <TD>{contact.serviceType || "—"}</TD>
                    <TD>
                      <ContactStatusBadge status={contact.status} />
                    </TD>
                    <TD className="text-sm text-muted-foreground">
                      {t.source[contact.source]}
                    </TD>
                    <TD>{contact._count.jobs}</TD>
                    <TD>{contact._count.tasks}</TD>
                    <TD className="text-sm text-muted-foreground">
                      {formatDate(contact.createdAt)}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
