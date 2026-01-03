import type { Metadata } from "next";
import "../globals.scss";

export const metadata: Metadata = {
  title: "Đăng ký - IT E-Learning",
  description: "Đăng ký tài khoản IT E-Learning",
};

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
