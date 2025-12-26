import { pageMetadata } from "@/lib/seo-config";

export const metadata = pageMetadata.faq;

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

