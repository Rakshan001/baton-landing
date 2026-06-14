import LenisProvider from "@/components/LenisProvider";

/**
 * Marketing route group: Lenis smooth-scroll + grain overlay are scoped HERE
 * (not in the root layout) so they don't fight Fumadocs' sidebar scroll/anchors
 * on /docs.
 */
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="marketing">
      <LenisProvider />
      {children}
      <div className="grain" aria-hidden="true" />
    </div>
  );
}
