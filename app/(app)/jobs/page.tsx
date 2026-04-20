import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getLocale, getDictionary } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { buttonVariants } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { JobStatusBadge } from "@/components/shared/status-badge";
import { JobStatusSelect } from "@/components/jobs/job-status-select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { JobStatus, Prisma } from "@prisma/client";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  const t = getDictionary(getLocale());
  const j = t.jobs;

  const where: Prisma.JobWhereInput = { userId: user.id };
  if (params.status && Object.values(JobStatus).includes(params.status as JobStatus)) {
    where.status = params.status as JobStatus;
  }

  const jobs = await prisma.job.findMany({
    where,
    include: { contact: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={j.title}
        description={j.desc}
      />
      <Card>
        <CardContent className="pt-6">
          <form method="get" className="mb-4 flex gap-3">
            <Select name="status" defaultValue={params.status ?? ""}>
              <option value="">{j.allStatuses}</option>
              {Object.values(JobStatus).map((s) => (
                <option key={s} value={s}>
                  {t.status.job[s]}
                </option>
              ))}
            </Select>
            <button
              className={buttonVariants({ variant: "outline", size: "default" })}
              type="submit"
            >
              {j.apply}
            </button>
          </form>

          {jobs.length === 0 ? (
            <EmptyState
              title={j.noJobsTitle}
              description={j.noJobsDesc}
            />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>{j.colTitle}</TH>
                  <TH>{j.colContact}</TH>
                  <TH>{j.colValue}</TH>
                  <TH>{j.colStatus}</TH>
                  <TH>{j.colChangeStatus}</TH>
                  <TH>{j.colCreated}</TH>
                </TR>
              </THead>
              <TBody>
                {jobs.map((j) => (
                  <TR key={j.id}>
                    <TD className="font-medium">{j.title}</TD>
                    <TD>
                      <Link
                        href={`/contacts/${j.contact.id}`}
                        className="hover:underline"
                      >
                        {j.contact.fullName}
                      </Link>
                    </TD>
                    <TD>{formatCurrency(j.estimatedValue, j.currency)}</TD>
                    <TD>
                      <JobStatusBadge status={j.status} />
                    </TD>
                    <TD>
                      <JobStatusSelect jobId={j.id} status={j.status} />
                    </TD>
                    <TD className="text-sm text-muted-foreground">
                      {formatDate(j.createdAt)}
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
