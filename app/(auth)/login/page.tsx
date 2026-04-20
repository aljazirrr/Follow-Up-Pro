import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getLocale, getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const locale = getLocale();
  const t = getDictionary(locale).auth;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.welcomeBack}</CardTitle>
        <CardDescription>{t.signInDesc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
        <p className="text-center text-sm text-muted-foreground">
          {t.noAccount}{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            {t.createOne}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
