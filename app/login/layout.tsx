import type { Metadata } from "next";
import "../globals.scss";

export const metadata: Metadata = {
  title: "Đăng nhập - IT E-Learning",
  description: "Đăng nhập vào hệ thống IT E-Learning",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
