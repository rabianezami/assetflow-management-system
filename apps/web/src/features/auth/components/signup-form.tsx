"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { signup } from "@/features/auth/api/signup";
import { ApiClientError } from "@/lib/api/client";
import { Link, useRouter } from "@/i18n/navigation";

export function SignupForm() {
  const t = useTranslations("Auth");
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        organizationName: organizationName.trim(),
      });
      router.push("/login?registered=1");
    } catch (err) {
      if (err instanceof ApiClientError && err.code === "CONFLICT") {
        setError(t("emailTaken"));
      } else {
        setError(t("signupFailed"));
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-name">{t("name")}</Label>
        <Input
          id="signup-name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-email">{t("email")}</Label>
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-password">{t("password")}</Label>
        <Input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
        <p className="text-caption text-muted-foreground">{t("passwordHint")}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-org">{t("organizationName")}</Label>
        <Input
          id="signup-org"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          required
        />
      </div>

      {error ? (
        <p className="text-body-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? t("creatingAccount") : t("createAccount")}
      </Button>

      <p className="text-center text-body-sm text-muted-foreground">
        {t("hasAccount")}{" "}
        <Link href="/login" className="text-foreground underline-offset-4 hover:underline">
          {t("signIn")}
        </Link>
      </p>
    </form>
  );
}
