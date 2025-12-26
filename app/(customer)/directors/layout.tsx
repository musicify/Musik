import { pageMetadata } from "@/lib/seo-config";

export const metadata = pageMetadata.directors;

export default function DirectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

