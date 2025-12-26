export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Auth pages have their own layout without the main header/footer */}
      {children}
    </div>
  );
}

