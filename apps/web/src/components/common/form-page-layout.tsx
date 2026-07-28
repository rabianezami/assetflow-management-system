import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormPageLayoutProps = {
  title: string;
  cancelLabel: string;
  cancelHref: string;
  children: ReactNode;
};

export function FormPageLayout({
  title,
  cancelLabel,
  cancelHref,
  children,
}: FormPageLayoutProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <header className="flex h-[var(--header-height)] items-center gap-4 border-b border-border bg-background px-[var(--page-padding-x)]">
        <Link
          href={cancelHref}
          className={cn(buttonVariants({ variant: "outline" }), "h-9")}
        >
          {cancelLabel}
        </Link>
        <h1 className="text-heading-sm font-heading text-foreground">{title}</h1>
      </header>
      <div className="flex flex-1 justify-center px-[var(--page-padding-x)] py-8">
        <div className="w-full max-w-lg">{children}</div>
      </div>
    </div>
  );
}
