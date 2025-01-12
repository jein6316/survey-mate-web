import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { Providers } from "./providers";
import Sidebar from "./component/layout/SideBar";
import { cookies } from "next/headers";

let title = "Next.js + Postgres Auth Starter";
let description =
  "This is a Next.js starter kit that uses NextAuth.js for simple email + password login and a Postgres database to persist the data.";

export const metadata = {
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  metadataBase: new URL("https://nextjs-postgres-auth.vercel.app"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const isLoggedIn = cookieStore.get("accessToken")?.value;
  console.log(">>>>>>>>>>>>>>");
  console.log(isLoggedIn);
  return (
    <html lang="en">
      <Providers>
        <body className={GeistSans.variable}>
          {/* Sidebar */}
          {isLoggedIn && <Sidebar />}
          <main className="flex-1 ml-64 bg-gray-50 p-8">{children}</main>
        </body>
      </Providers>
    </html>
  );
}
