import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/ThemeScript";

// Headings — Sora: modern, geometric, confident.
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Body / UI — Manrope: clean, highly readable for long text and dense UI.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lessons Generator — AI lessons for teachers",
    template: "%s · Lessons Generator",
  },
  description:
    "Create teacher-ready lessons in seconds. Generate slides, worksheets, quizzes, lesson plans and assessments — built for real classrooms and aligned to standards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
