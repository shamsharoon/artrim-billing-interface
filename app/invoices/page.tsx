// Make this page dynamic to avoid build-time errors
export const dynamic = "force-dynamic"

import { getInvoices, testConnection } from "@/lib/supabase"
import InvoiceList from "@/components/InvoiceList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"

// Local helper to render the common page layout
/**
 * Renders the common page layout with the given content.
 * @param {JSX.Element} content - The content to render inside the layout.
 * @returns {JSX.Element} The wrapped content.
 */
const renderPage = (content) => (
  <div className="container mx-auto py-8 px-4">
    {content}
  </div>
);

/**
 * Renders the error header component.
 */
const ErrorHeader = () => <h1 className="text-3xl font-bold mb-8">Invoices</h1>;

const renderErrorCard = (title, message, additionalContent = null) => (
  <Card className="border-red-200 bg-red-50">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-red-800">
        <AlertCircle className="h-5 w-5" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-red-700 mb-4">{message}</p>
      {additionalContent}
    </CardContent>
  </Card>
);

/**
 * Asynchronous component that fetches and displays invoices, with initial connection checking.
 */
export default async function InvoicesPage() {
  // Test database connection to ensure it is available before proceeding
  const connectionTest = await testConnection();

  // If connection test fails, render an error message with details
  if (!connectionTest.success) {
    return renderPage(
      <>
        <ErrorHeader />
        {renderErrorCard(
          "Database Connection Error",
          connectionTest.message,
          <div className="text-sm text-red-600">
            <p className="font-semibold">Please check:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Your Supabase environment variables are set correctly</li>
              <li>Your database tables have been created</li>
              <li>Row Level Security policies are configured</li>
            </ul>
          </div>
        )}
      </>
    );
  }

  try {
    // Fetch invoices from the database if connection is successful
    const invoices = await getInvoices();

    return renderPage(
      <>
        <div className="flex items-center gap-2 mb-8">
          <h1 className="text-3xl font-bold">Invoices</h1>
          <CheckCircle className="h-5 w-5 text-green-600" title="Database connected" />
        </div>
        <InvoiceList invoices={invoices} />
      </>
    );
  } catch (error) {
    // Handle errors that occur during invoice fetching and render an error message
    console.error("Error loading invoices:", error);

    return renderPage(
      <>
        <ErrorHeader />
        {renderErrorCard(
          "Error Loading Invoices",
          error instanceof Error ? error.message : "An unexpected error occurred"
        )}
      </>
    );
  }
}