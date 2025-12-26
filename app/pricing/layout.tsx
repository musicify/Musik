import { pageMetadata } from "@/lib/seo-config";

export const metadata = pageMetadata.pricing;

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

