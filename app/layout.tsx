
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Book Review Platform",
  description: "A platform to review your favorite books",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto p-6 text-left">
          {children}
        </main>
      </body>
    </html>
  );
}
