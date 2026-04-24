import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { UpgradeBanner } from "@/components/app/upgrade-banner";

const SKIP_ONBOARDING_REDIRECT = ["/onboarding", "/settings", "/billing"];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user as { id?: string; email?: string } | undefined;
  if (!user?.id) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { onboardingCompleted: true, subscription: { select: { plan: true } } },
  });
  const plan = dbUser?.subscription?.plan ?? "FREE";

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const shouldSkip = SKIP_ONBOARDING_REDIRECT.some((p) => pathname.startsWith(p));
  if (!dbUser?.onboardingCompleted && !shouldSkip) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar email={user.email ?? ""} />
        <UpgradeBanner plan={plan} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
