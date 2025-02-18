import "./globals.css";
import { GeistSans } from "geist/font/sans";
import Providers from "./providers";
import AlertModal from "@/app/component/common/modal/AlertModal";
import LoadingBar from "@/app/component/common/modal/LoadingBar";
import HeaderRight from "@/app/component/common/header/HeaderRight";

let title = "Survey Mate";
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
  return (
    <html lang="en">
      <Providers>
        <body className={GeistSans.variable}>
          <LoadingBar />
          <AlertModal />
          {/* Header */}
          <header className="flex justify-end items-center p-4 bg-white shadow-md">
            <HeaderRight />
          </header>
          <main className={`flex-1 bg-gray-50 p-8`}>{children}</main>
        </body>
      </Providers>
    </html>
  );
}
