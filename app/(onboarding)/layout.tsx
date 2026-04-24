import Link from "next/link";
import { redirect } from "next/navigation";
import { Zap } from "lucide-react";
import { auth } from "@/lib/auth";
import { LanguageSwitcher } from "@/components/language-switcher";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="border-b bg-background">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" />
            </div>
            Rebooker
          </Link>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  );
}
