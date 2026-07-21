import type { ReactNode } from "react";

type AppHeaderProps = {
  children?: ReactNode;
};

export function AppHeader({ children }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center border-b border-border bg-background/95 px-[var(--page-padding-x)] backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="ms-auto flex items-center gap-2">{children}</div>
    </header>
  );
}
