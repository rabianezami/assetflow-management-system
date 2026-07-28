import type { ReactNode } from "react";

import { DirectionalIcon } from "@/components/common/directional-icon";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

type SettingsLayoutProps = {
  title: string;
  backLabel: string;
  backHref: string;
  tabs: ReactNode;
  children: ReactNode;
};

export function SettingsLayout({
  title,
  backLabel,
  backHref,
  tabs,
  children,
}: SettingsLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-[var(--content-max-width)] flex-col gap-6">
      <header className="flex flex-col gap-4">
        <Link
          href={backHref}
          className="inline-flex w-fit items-center gap-2 text-body-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <DirectionalIcon icon={ArrowLeft} className="size-4" />
          {backLabel}
        </Link>
        <h1 className="text-heading-lg font-heading text-foreground">{title}</h1>
        {tabs}
      </header>
      {children}
    </div>
  );
}
