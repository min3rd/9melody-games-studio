import { cookies } from "next/headers";
import { setServerLanguage } from "@/lib/i18n";
import "./globals.css";
import { ThemeToggle, UserMenu } from "@/components/ui";
import ClientInit from "@/components/ClientInit";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // if a cookie-set language exists, use that for the document's lang attribute
  // Note: cookies() returns a Promise in Next.js' server runtime and must be awaited.
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("lang")?.value;
  const htmlLang = cookieLang === "vi" ? "vi" : "en";
  // set the i18n singleton language during server render so server-rendered
  // content uses the preferred language
  setServerLanguage(htmlLang);

  return (
    <html lang={htmlLang}>
      <body
        className="antialiased"
      >
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
          <ThemeToggle />
          {cookieStore.get('userEmail')?.value ? (
            <UserMenu email={cookieStore.get('userEmail')?.value} isAdmin={cookieStore.get('isAdmin')?.value === 'true'} />
          ) : (
            <a href="/public/auth/login" className="btn btn-ghost">Login</a>
          )}
        </div>
        <ClientInit />
        {children}
      </body>
    </html>
  );
}
