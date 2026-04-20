import Link from "next/link";
import { RegisterForm } from "./register-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getLocale, getDictionary } from "@/lib/i18n";

export default function RegisterPage() {
  const locale = getLocale();
  const t = getDictionary(locale).auth;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.createAccount}</CardTitle>
        <CardDescription>{t.createAccountDesc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          {t.haveAccount}{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            {t.signIn}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
