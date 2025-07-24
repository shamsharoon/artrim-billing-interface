import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Home, Plus, Hammer } from "lucide-react";

/**
 * Renders the Navbar component.
 */
export function Navbar(): JSX.Element {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <Hammer className="h-6 w-6 text-orange-300" />
            <span className="text-xl font-bold text-white">Artrim</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {renderNavButton("/", <Home className="mr-2 h-4 w-4" />, "Home")}
            {renderNavButton("/invoices", <FileText className="mr-2 h-4 w-4" />, "Invoices")}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {renderActionButton()}
        </div>
      </div>
    </nav>
  );
}

/**
 * Renders a navigation button with the given href, icon, and text.
 */
function renderNavButton(href: string, icon: JSX.Element, text: string): JSX.Element {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className="text-gray-300 hover:text-white hover:bg-gray-800"
      >
        {icon}
        {text}
      </Button>
    </Link>
  );
}

/**
 * Renders the action button.
 */
function renderActionButton(): JSX.Element {
  return (
    <Link href="/invoices/new">
      <Button
        size="sm"
        className="bg-orange-300 hover:bg-orange-500 text-gray-900"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Invoice
      </Button>
    </Link>
  );
}