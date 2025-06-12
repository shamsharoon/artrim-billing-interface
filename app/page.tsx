import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-800">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-4xl font-bold text-white">Invoice Management App</h1>
        <p className="text-xl text-gray-300">Create, manage, and download professional invoices</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/invoices/new">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              Create New Invoice
            </Button>
          </Link>
          <Link href="/invoices">
            <Button size="lg" variant="outline">
              View All Invoices
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
