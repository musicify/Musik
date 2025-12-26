import { pageMetadata } from "@/lib/seo-config";

export const metadata = pageMetadata.marketplace;

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

