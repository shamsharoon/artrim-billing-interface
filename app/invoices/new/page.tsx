// Make this page dynamic to avoid build-time errors
export const dynamic = "force-dynamic"

import { getClients, testConnection } from "@/lib/supabase"
import InvoiceForm from "@/components/InvoiceForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default async function NewInvoicePage() {
  // Test database connection first
  const connectionTest = await testConnection()

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
    )
  }

  try {
    const clients = await getClients()

    if (clients.length === 0) {
      return (
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8">Create New Invoice</h1>
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">No Clients Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700">
                You need to create at least one client before creating an invoice. Please run the sample data script or
                add clients manually.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Create New Invoice</h1>
        <InvoiceForm clients={clients} />
      </div>
    )
  } catch (error) {
    console.error("Error loading clients:", error)

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Create New Invoice</h1>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              Error Loading Clients
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
