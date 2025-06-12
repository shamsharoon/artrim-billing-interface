import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Home, Plus, Hammer } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <Hammer className="h-6 w-6 text-orange-300" />
            <span className="text-xl font-bold text-white">Artrim</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/invoices">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <FileText className="mr-2 h-4 w-4" />
                Invoices
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/invoices/new">
            <Button
              size="sm"
              className="bg-orange-300 hover:bg-orange-500 text-gray-900"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
