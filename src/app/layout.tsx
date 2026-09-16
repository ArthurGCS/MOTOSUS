import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MOTOSUS - Entrega de Medicamentos do SUS",
  description: "Sistema de entrega de remédios da UBS e Alto Custo direto na casa do cidadão.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
