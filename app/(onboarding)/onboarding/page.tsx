import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getLocale, getDictionary } from "@/lib/i18n";
import { IndustryPicker } from "@/components/onboarding/industry-picker";

export default async function OnboardingPage() {
  const user = await requireUser();
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { onboardingCompleted: true },
  });

  if (dbUser?.onboardingCompleted) redirect("/dashboard");

  const t = getDictionary(getLocale()).onboarding;

  return (
    <div className="py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <p className="mt-2 text-muted-foreground">{t.desc}</p>
      </div>
      <IndustryPicker />
    </div>
  );
}
