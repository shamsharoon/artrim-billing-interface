// Make this page dynamic to avoid build-time errors
/** Forces the page to be dynamic to avoid build-time errors */
export const dynamic = "force-dynamic";

/** Imports the testConnection function from the supabase library */
import { testConnection } from "@/lib/supabase";

/** Imports the InvoiceForm component from the components directory */
import InvoiceForm from "@/components/InvoiceForm";

/** Imports UI components from the card module */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** Imports the AlertCircle icon from lucide-react */
import { AlertCircle } from "lucide-react";

/**
 * Asynchronous function to render the New Invoice page.
 * It tests the database connection and either shows an error or the form.
 * @returns {Promise<JSX.Element>} The JSX element to render.
 */
export default async function NewInvoicePage() {
  // Test database connection first
  /** @type {{ success: boolean, message: string }} */
  const connectionTest = await testConnection();

  // If connection test fails, display error message
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