import { Header } from "@/components/header";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recipe App",
  description: "Inworld exercise version A",
};

type RootLayoutProps = Readonly<{ children: React.ReactNode; }>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
