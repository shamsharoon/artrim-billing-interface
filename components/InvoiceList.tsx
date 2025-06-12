import type React from "react"
import Link from "next/link"
import type { Invoice } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Plus } from "lucide-react"

interface InvoiceListProps {
  invoices: (Invoice & { clients: { name: string } })[]
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-CA")
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Invoices</CardTitle>
        <Link href="/invoices/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" /> New Invoice
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-12 bg-muted/50 p-4 text-sm font-medium">
            <div className="col-span-2">Invoice #</div>
            <div className="col-span-3">Client</div>
            <div className="col-span-3">Project</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1 text-right">Total</div>
            <div className="col-span-1"></div>
          </div>
          <div className="divide-y">
            {invoices.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No invoices found. Create your first invoice!</div>
            ) : (
              invoices.map((invoice) => (
                <div key={invoice.id} className="grid grid-cols-12 items-center p-4">
                  <div className="col-span-2 font-medium">{invoice.invoice_number}</div>
                  <div className="col-span-3">{invoice.clients.name}</div>
                  <div className="col-span-3 truncate" title={invoice.project_name}>
                    {invoice.project_name}
                  </div>
                  <div className="col-span-2">{formatDate(invoice.date)}</div>
                  <div className="col-span-1 text-right font-medium">{formatCurrency(invoice.total)}</div>
                  <div className="col-span-1 flex justify-end">
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
  )
}

export default InvoiceList
