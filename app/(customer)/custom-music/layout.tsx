import { pageMetadata } from "@/lib/seo-config";

export const metadata = pageMetadata.customMusic;

export default function CustomMusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

