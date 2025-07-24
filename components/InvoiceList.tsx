import type React from "react";
import Link from "next/link";
import type { Invoice } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";

/**
 * Props interface for the InvoiceList component.
 */
interface InvoiceListProps {
  invoices: (Invoice & { clients: { address: string } })[];
}

/**
 * A React component that displays a list of invoices.
 * @param {InvoiceListProps} props - The properties for the component.
 */
const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  // Format currency
  /**
   * Formats a number as Canadian currency.
   * @param {number} amount - The amount to format.
   * @returns {string} The formatted currency string.
   */
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  };

  // Format date
  /**
   * Formats a date string to a locale-specific date string.
   * @param {string} dateString - The date string to format.
   * @returns {string} The formatted date string.
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-CA");
  };

  // Render the UI for the invoice list
  return (
    // Main card container for the invoice list
    <Card className="w-full">
      // Header section with title and new invoice button
      <CardHeader className="flex flex-row items-center justify-between">
        // Title of the card
        <CardTitle>Invoices</CardTitle>
        // Link to create a new invoice
        <Link href="/invoices/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" /> New Invoice
          </Button>
        </Link>
      </CardHeader>
      // Content section of the card
      <CardContent>
        // Container for the invoice table
        <div className="rounded-md border">
          // Header row for the table columns
          <div className="grid grid-cols-12 bg-muted/50 p-4 text-sm font-medium">
            <div className="col-span-4">Client Address</div>
            <div className="col-span-3">Project Number</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1"></div>
          </div>
          // List of invoice items
          <div className="divide-y">
            {invoices.length === 0 ? (
              // Message when no invoices are found
              <div className="p-4 text-center text-muted-foreground">
                No invoices found. Create your first invoice!
              </div>
            ) : (
              // Map through invoices to display each one
              invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="grid grid-cols-12 items-center p-4"
                >
                  <div
                    className="col-span-4 truncate"
                    title={invoice.clients.address}
                  >
                    {invoice.clients.address}
                  </div>
                  <div
                    className="col-span-3 truncate"
                    title={invoice.project_number}
                  >
                    {invoice.project_number}
                  </div>
                  <div className="col-span-2">{formatDate(invoice.date)}</div>
                  <div className="col-span-2 text-right font-medium">
                    {formatCurrency(invoice.total)}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    // Link to view the invoice
                    <Link href={`/invoices/${invoice.id}`}>
                      <Button variant="ghost" size="icon" title="View Invoice">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceList;