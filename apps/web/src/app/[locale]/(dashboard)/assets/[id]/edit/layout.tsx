export default function EditAssetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="-mx-[var(--page-padding-x)] -my-[var(--page-padding-y)] flex min-h-[calc(100svh-var(--header-height))] flex-col">
      {children}
    </div>
  );
}
