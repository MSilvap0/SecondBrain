import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

// Fonte principal - Inter (usada por GitHub, Vercel, Linear)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

// Fonte para títulos - Playfair Display (elegante e sofisticada)
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Second Brain - Organize e Expanda suas Ideias com IA",
  description: "Transforme suas ideias em projetos concretos com inteligência artificial. Second Brain é a plataforma que organiza, expande e conecta seus pensamentos, ajudando você a capturar insights, desenvolver conceitos e materializar suas melhores ideias com o poder da IA.",
  keywords: ["second brain", "ideias", "organização", "produtividade", "IA", "inteligência artificial", "gestão de conhecimento", "brainstorming", "criatividade", "inovação", "notas inteligentes"],
  icons: {
    icon: '/favicon.png?v=2',
    shortcut: '/favicon.png?v=2',
    apple: '/favicon.png?v=2',
  },
  openGraph: {
    title: "Second Brain - Organize e Expanda suas Ideias com IA",
    description: "Transforme suas ideias em projetos concretos com inteligência artificial. Capture, organize e desenvolva seus pensamentos com o poder da IA.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Second Brain - Organize e Expanda suas Ideias com IA",
    description: "Transforme suas ideias em projetos concretos com inteligência artificial.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} h-full`}
    >
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
