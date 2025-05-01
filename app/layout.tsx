import type { Metadata } from "next";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "Finergise - Digital Banking for Rural Communities",
  description: "Access banking services right from your community with secure and easy-to-use digital banking solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}