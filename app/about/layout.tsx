import { pageMetadata } from "@/lib/seo-config";

export const metadata = pageMetadata.about;

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

