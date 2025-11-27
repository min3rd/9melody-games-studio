import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
