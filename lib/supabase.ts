import { createClient } from "@supabase/supabase-js"

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Client = {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  created_at: string
}

export type Invoice = {
  id: string
  client_id: string
  project_name: string
  project_number: string
  invoice_number: string
  date: string
  payment_condition: string
  note: string | null
  subtotal: number
  discount: number
  tax_rate: number
  tax_amount: number
  total: number
  created_at: string
}

export type InvoiceItem = {
  id: string
  invoice_id: string
  description: string
  quantity: number
  unit_price: number
  line_total: number
  created_at: string
}

export type InvoiceWithClient = Invoice & {
  clients: Client
}

// Test database connection
export async function testConnection() {
  try {
    const { data, error } = await supabase.from("clients").select("count").limit(1)
    if (error) throw error
    return { success: true, message: "Database connection successful" }
  } catch (error) {
    console.error("Database connection failed:", error)
    return { success: false, message: `Database connection failed: ${error.message}` }
  }
}

// Database functions
export async function getInvoices(): Promise<InvoiceWithClient[]> {
  try {
    // First, get all invoices
    const { data: invoices, error: invoicesError } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false })

    if (invoicesError) {
      console.error("Error fetching invoices:", invoicesError)
      throw new Error(`Failed to fetch invoices: ${invoicesError.message}`)
    }

    if (!invoices || invoices.length === 0) {
      return []
    }

    // Get all clients
    const { data: clients, error: clientsError } = await supabase.from("clients").select("*")

    if (clientsError) {
      console.error("Error fetching clients:", clientsError)
      throw new Error(`Failed to fetch clients: ${clientsError.message}`)
    }

    // Manually join the data
    const invoicesWithClients = invoices.map((invoice) => {
      const client = clients?.find((c) => c.id === invoice.client_id)
      return {
        ...invoice,
        clients: client || { id: "", name: "Unknown Client", email: null, phone: null, address: null, created_at: "" },
      }
    })

    return invoicesWithClients
  } catch (error) {
    console.error("Error in getInvoices:", error)
    throw error
  }
}

export async function getInvoice(id: string) {
  try {
    // Get the invoice
    const { data: invoice, error: invoiceError } = await supabase.from("invoices").select("*").eq("id", id).single()

    if (invoiceError) {
      console.error("Error fetching invoice:", invoiceError)
      throw new Error(`Failed to fetch invoice: ${invoiceError.message}`)
    }

    // Get the client
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("id", invoice.client_id)
      .single()

    if (clientError) {
      console.error("Error fetching client:", clientError)
      throw new Error(`Failed to fetch client: ${clientError.message}`)
    }

    // Get the invoice items
    const { data: items, error: itemsError } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", id)
      .order("created_at", { ascending: true })

    if (itemsError) {
      console.error("Error fetching invoice items:", itemsError)
      throw new Error(`Failed to fetch invoice items: ${itemsError.message}`)
    }

    return {
      invoice: { ...invoice, clients: client },
      items: items || [],
    }
  } catch (error) {
    console.error("Error in getInvoice:", error)
    throw error
  }
}

export async function getClients(): Promise<Client[]> {
  try {
    const { data, error } = await supabase.from("clients").select("*").order("name")

    if (error) {
      console.error("Error fetching clients:", error)
      throw new Error(`Failed to fetch clients: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Error in getClients:", error)
    throw error
  }
}

export async function createInvoice(
  invoice: Omit<Invoice, "id" | "created_at">,
  items: Omit<InvoiceItem, "id" | "invoice_id" | "created_at">[],
) {
  try {
    // Insert the invoice
    const { data: invoiceData, error: invoiceError } = await supabase.from("invoices").insert([invoice]).select()

    if (invoiceError) {
      console.error("Error creating invoice:", invoiceError)
      throw new Error(`Failed to create invoice: ${invoiceError.message}`)
    }

    const invoiceId = invoiceData[0].id

    // Insert the invoice items
    if (items.length > 0) {
      const itemsWithInvoiceId = items.map((item) => ({
        ...item,
        invoice_id: invoiceId,
      }))

      const { error: itemsError } = await supabase.from("invoice_items").insert(itemsWithInvoiceId)

      if (itemsError) {
        console.error("Error creating invoice items:", itemsError)
        throw new Error(`Failed to create invoice items: ${itemsError.message}`)
      }
    }

    return invoiceId
  } catch (error) {
    console.error("Error in createInvoice:", error)
    throw error
  }
}

export async function updateInvoice(
  id: string,
  invoice: Partial<Omit<Invoice, "id" | "created_at">>,
  items: Omit<InvoiceItem, "id" | "invoice_id" | "created_at">[],
) {
  try {
    // Update the invoice
    const { error: invoiceError } = await supabase.from("invoices").update(invoice).eq("id", id)

    if (invoiceError) {
      console.error("Error updating invoice:", invoiceError)
      throw new Error(`Failed to update invoice: ${invoiceError.message}`)
    }

    // Delete existing items
    const { error: deleteError } = await supabase.from("invoice_items").delete().eq("invoice_id", id)

    if (deleteError) {
      console.error("Error deleting invoice items:", deleteError)
      throw new Error(`Failed to delete invoice items: ${deleteError.message}`)
    }

    // Insert new items
    if (items.length > 0) {
      const itemsWithInvoiceId = items.map((item) => ({
        ...item,
        invoice_id: id,
      }))

      const { error: itemsError } = await supabase.from("invoice_items").insert(itemsWithInvoiceId)

      if (itemsError) {
        console.error("Error creating new invoice items:", itemsError)
        throw new Error(`Failed to create new invoice items: ${itemsError.message}`)
      }
    }

    return id
  } catch (error) {
    console.error("Error in updateInvoice:", error)
    throw error
  }
}
