"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getInvoice, type Invoice, type InvoiceItem } from "@/lib/supabase";
import InvoiceForm from "@/components/InvoiceForm";
import InvoicePdfPreview from "@/components/InvoicePdfPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<Invoice & { clients: any }>();
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [activeTab, setActiveTab] = useState("edit");

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, router]);

  const handleUpdateSuccess = (id: string) => {
    // Refresh the data after successful update
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

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Invoice Details</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="edit">Edit Invoice</TabsTrigger>
          <TabsTrigger value="preview">PDF Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <InvoiceForm
            existingInvoice={invoice}
            existingItems={items}
            onSuccess={handleUpdateSuccess}
          />
        </TabsContent>

        <TabsContent value="preview">
          <InvoicePdfPreview invoice={invoice} items={items} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
