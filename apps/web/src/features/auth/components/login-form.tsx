"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";

export function LoginForm() {
  const t = useTranslations("Auth");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError(t("invalidCredentials"));
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(t("invalidCredentials"));
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="login-email">{t("email")}</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="login-password">{t("password")}</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error ? (
        <p className="text-body-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? t("signingIn") : t("signIn")}
      </Button>

      <p className="text-center text-body-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/signup" className="text-foreground underline-offset-4 hover:underline">
          {t("createAccount")}
        </Link>
      </p>
    </form>
  );
}
