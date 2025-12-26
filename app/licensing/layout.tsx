import { pageMetadata } from "@/lib/seo-config";

export const metadata = pageMetadata.licensing;

export default function LicensingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

