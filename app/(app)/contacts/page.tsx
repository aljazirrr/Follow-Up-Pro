import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { LeadSource, Prisma } from "@prisma/client";

type SearchParams = {
  q?: string;
  source?: string;
};

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const user = await requireUser();

  const q = params.q?.trim();
  const source = params.source;

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

  const contacts = await prisma.contact.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { jobs: true, tasks: true } },
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        description="Your leads and customers."
        actions={
          <Link
            href="/contacts/new"
            className={buttonVariants({ size: "sm" })}
          >
            <Plus className="h-4 w-4" /> New contact
          </Link>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <form
            method="get"
            className="mb-4 grid gap-3 sm:grid-cols-[1fr_200px_auto]"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Search by name, email, phone, company…"
                defaultValue={q ?? ""}
                className="pl-8"
              />
            </div>
            <Select name="source" defaultValue={source ?? ""}>
              <option value="">All sources</option>
              {Object.values(LeadSource).map((s) => (
                <option key={s} value={s}>
                  {s.toLowerCase()}
                </option>
              ))}
            </Select>
            <button
              className={buttonVariants({ variant: "outline", size: "default" })}
              type="submit"
            >
              Apply
            </button>
          </form>

          {contacts.length === 0 ? (
            <EmptyState
              title={q || source ? "No contacts match your filters" : "No contacts yet"}
              description={
                q || source
                  ? "Try clearing your filters."
                  : "Add your first lead to get started."
              }
              action={
                <Link
                  href="/contacts/new"
                  className={buttonVariants({ size: "sm" })}
                >
                  <Plus className="h-4 w-4" /> Add contact
                </Link>
              }
            />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Name</TH>
                  <TH>Service</TH>
                  <TH>Source</TH>
                  <TH>Jobs</TH>
                  <TH>Tasks</TH>
                  <TH>Created</TH>
                </TR>
              </THead>
              <TBody>
                {contacts.map((c) => (
                  <TR key={c.id}>
                    <TD>
                      <Link
                        href={`/contacts/${c.id}`}
                        className="font-medium hover:underline"
                      >
                        {c.fullName}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {c.email || c.phone || "—"}
                      </div>
                    </TD>
                    <TD>{c.serviceType || "—"}</TD>
                    <TD className="text-sm text-muted-foreground">
                      {c.source.toLowerCase()}
                    </TD>
                    <TD>{c._count.jobs}</TD>
                    <TD>{c._count.tasks}</TD>
                    <TD className="text-sm text-muted-foreground">
                      {formatDate(c.createdAt)}
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
