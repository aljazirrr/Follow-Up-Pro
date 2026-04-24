import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { startOfDay, endOfDay } from "date-fns";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { UpgradeBanner } from "@/components/app/upgrade-banner";

const SKIP_ONBOARDING_REDIRECT = ["/settings", "/billing"];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user as { id?: string; email?: string } | undefined;
  if (!user?.id) redirect("/login");

  const now = new Date();

  const [dbUser, overdueCount, todayCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { onboardingCompleted: true, subscription: { select: { plan: true } } },
    }),
    prisma.followUpTask.count({
      where: { userId: user.id, status: "PENDING", dueDate: { lt: startOfDay(now) } },
    }),
    prisma.followUpTask.count({
      where: { userId: user.id, status: "PENDING", dueDate: { gte: startOfDay(now), lte: endOfDay(now) } },
    }),
  ]);

  const plan = dbUser?.subscription?.plan ?? "FREE";

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const shouldSkip = SKIP_ONBOARDING_REDIRECT.some((p) => pathname.startsWith(p));
  if (!dbUser?.onboardingCompleted && !shouldSkip) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar overdueCount={overdueCount} todayCount={todayCount} />
      <div className="flex flex-1 flex-col">
        <Topbar email={user.email ?? ""} />
        <UpgradeBanner plan={plan} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
