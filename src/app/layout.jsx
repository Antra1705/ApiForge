import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata = {
  title: "APIForge: AI API Generator",
  description: "Generate backend APIs using natural language.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-surface text-on-surface min-h-screen selection:bg-primary-fixed-variant selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
