import { cookies } from "next/headers";
import { setServerLanguage } from "@/lib/i18n";
import "./globals.css";
// Header components moved to public/private layouts
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
        <ClientInit />
        {children}
      </body>
    </html>
  );
}
