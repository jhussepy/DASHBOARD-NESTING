import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vodafone Onboarding Command Center",
  description: "Centro de control para coordinar ingresos, accesos, formación y producción inicial.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
