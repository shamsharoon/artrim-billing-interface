import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * The Home component renders the main page with options to create or view invoices.
 * @returns {JSX.Element}
 */
export default function Home(): JSX.Element {
  return (
    // Main container with full screen height, centered items, and dark background
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-4xl font-bold text-white">
          Artrim Invoice Management
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          // Link to navigate to the new invoice page
          <Link href="/invoices/new">
            <Button size="lg" className="bg-orange-300 hover:bg-orange-500">
              Create New Invoice
            </Button>
          </Link>
          // Link to navigate to the list of all invoices
          <Link href="/invoices">
            <Button size="lg" variant="outline">
              View All Invoices
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}