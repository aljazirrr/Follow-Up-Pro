"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/lib/i18n/client";

export function RegisterForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { t } = useTranslation();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const res = await registerUser(form);

    if (!res.ok) {
      setSubmitting(false);
      toast.error(res.error);
      return;
    }

    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setSubmitting(false);

    if (!signInRes || signInRes.error) {
      toast.error(t.auth.accountCreatedSignInFailed);
      router.push("/login");
      return;
    }
    toast.success(t.auth.accountCreated);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="ownerName">{t.auth.yourName}</Label>
        <Input id="ownerName" name="ownerName" required autoComplete="name" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">{t.auth.email}</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">{t.auth.password}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
        <p className="text-xs text-muted-foreground">{t.auth.atLeast8}</p>
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? t.auth.creating : t.auth.createAccountBtn}
      </Button>
    </form>
  );
}
