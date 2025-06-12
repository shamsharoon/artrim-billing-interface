// Make this page dynamic to avoid build-time errors
export const dynamic = "force-dynamic";

import { testConnection } from "@/lib/supabase";
import InvoiceForm from "@/components/InvoiceForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default async function NewInvoicePage() {
  // Test database connection first
  const connectionTest = await testConnection();

  if (!connectionTest.success) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Create New Invoice</h1>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              Database Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{connectionTest.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Create New Invoice</h1>
      <InvoiceForm />
    </div>
  );
}
