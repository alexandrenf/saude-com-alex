import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Saúde com Alex - Blog de Saúde Pública",
  description: "Artigos e projetos sobre saúde pública.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geist.variable}`}>
      <body className="min-h-screen bg-gray-50">
        <TRPCReactProvider>
          <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Saúde com Alex</h1>
                </Link>
                <nav className="flex items-center space-x-8">
                  <Link 
                    href="/" 
                    className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                  >
                    Início
                  </Link>
                  <Link 
                    href="/blog" 
                    className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                  >
                    Blog
                  </Link>
                  <Link 
                    href="/admin" 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Admin
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          <main>
            {children}
          </main>
          <footer className="bg-white border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-gray-600">
                <p>© 2024 Saúde com Alex. Todos os direitos reservados.</p>
                <p className="mt-2 text-sm">Promovendo saúde pública através da informação e educação.</p>
              </div>
            </div>
          </footer>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
