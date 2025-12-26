import { pageMetadata } from "@/lib/seo-config";

export const metadata = pageMetadata.forArtists;

export default function ForArtistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

