// Make this page dynamic to avoid build-time errors
export const dynamic = "force-dynamic"

import { getInvoices, testConnection } from "@/lib/supabase"
import InvoiceList from "@/components/InvoiceList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"

export default async function InvoicesPage() {
  // Test database connection first
  const connectionTest = await testConnection()

  if (!connectionTest.success) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Invoices</h1>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              Database Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">{connectionTest.message}</p>
            <div className="text-sm text-red-600">
              <p className="font-semibold">Please check:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Your Supabase environment variables are set correctly</li>
                <li>Your database tables have been created</li>
                <li>Row Level Security policies are configured</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  try {
    const invoices = await getInvoices()

    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-2 mb-8">
          <h1 className="text-3xl font-bold">Invoices</h1>
          <CheckCircle className="h-5 w-5 text-green-600" title="Database connected" />
        </div>
        <InvoiceList invoices={invoices} />
      </div>
    )
  } catch (error) {
    console.error("Error loading invoices:", error)

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Invoices</h1>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              Error Loading Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error instanceof Error ? error.message : "An unexpected error occurred"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }
}
