"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getInvoice, type Invoice, type InvoiceItem } from "@/lib/supabase";
import InvoiceForm from "@/components/InvoiceForm";
import InvoicePdfPreview from "@/components/InvoicePdfPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// This file defines the InvoiceDetailPage component for displaying and editing invoice details.

/**
 * Component for displaying and editing invoice details.
 */
export default function InvoiceDetailPage() {
  const params = useParams();  // Get dynamic route parameters
  const router = useRouter();  // Get router for navigation
  const [loading, setLoading] = useState(true);  // State to manage loading state
  const [invoice, setInvoice] = useState<Invoice & { clients: any }>();  // State to hold invoice data
  const [items, setItems] = useState<InvoiceItem[]>([]);  // State to hold invoice items
  const [activeTab, setActiveTab] = useState("edit");  // State to manage active tab

  // Effect hook to fetch invoice data when component mounts or params.id changes
  useEffect(() => {
    // Asynchronous function to fetch invoice data
    const fetchData = async () => {
      try {
        // Handle dynamic parameter: params.id might be an array or a string
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (!id) throw new Error("Invoice ID not found");

        // Fetch invoice data
        const { invoice: invoiceData, items: itemsData } = await getInvoice(id);
        setInvoice(invoiceData as any);
        setItems(itemsData);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        alert("Failed to load invoice. Redirecting to invoices list.");
        router.push("/invoices");
      } finally {
        setLoading(false);  // Set loading to false after fetch attempt
      }
    };

    fetchData();
  }, [params.id, router]);

  /**
   * Handles successful update of an invoice by refreshing data and switching to preview tab.
   * @param {string} id - The ID of the updated invoice
   */
  const handleUpdateSuccess = (id: string) => {
    // Asynchronous function to fetch updated invoice data
    const fetchUpdatedData = async () => {
      try {
        const { invoice: invoiceData, items: itemsData } = await getInvoice(id);
        setInvoice(invoiceData as any);
        setItems(itemsData);
        setActiveTab("preview"); // Switch to preview tab after update
      } catch (error) {
        console.error("Error refreshing invoice data:", error);
      }
    };

    fetchUpdatedData();
  };

  if (loading) {
    // Render loading state
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading invoice...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invoice) {
    // Render invoice not found message
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="text-center p-8">
            <p>Invoice not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render the main invoice details page with tabs
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Invoice Details</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="edit">Edit Invoice</TabsTrigger>
          <TabsTrigger value="preview">PDF Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          {/* Render the invoice form for editing */}
          <InvoiceForm
            existingInvoice={invoice}
            existingItems={items}
            onSuccess={handleUpdateSuccess}
          />
        </TabsContent>

        <TabsContent value="preview">
          {/* Render the PDF preview of the invoice */}
          <InvoicePdfPreview invoice={invoice} items={items} />
        </TabsContent>
      </Tabs>
    </div>
  );
}