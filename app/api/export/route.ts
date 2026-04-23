import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const contacts = await prisma.contact.findMany({
    where: { userId },
    include: {
      jobs: {
        select: {
          title: true,
          status: true,
          estimatedValue: true,
          currency: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "Name",
    "Email",
    "Phone",
    "Company",
    "Service Type",
    "Source",
    "Status",
    "Last Contacted",
    "Created",
    "Job Count",
    "Job Titles",
  ];

  const rows = contacts.map((c) => [
    c.fullName,
    c.email ?? "",
    c.phone ?? "",
    c.companyName ?? "",
    c.serviceType ?? "",
    c.source,
    c.status,
    c.lastContactedAt ? c.lastContactedAt.toISOString().split("T")[0] : "",
    c.createdAt.toISOString().split("T")[0],
    String(c.jobs.length),
    c.jobs.map((j) => j.title).join("; "),
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\r\n");

  const date = new Date().toISOString().split("T")[0];
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rebooker-contacts-${date}.csv"`,
    },
  });
}
