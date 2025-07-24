import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Type representing a Client in the database.
 */
export type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
};

/**
 * Type representing an Invoice in the database.
 */
export type Invoice = {
  id: string;
  client_address: string;
  project_number: string;
  date: string;
  payment_condition: string;
  note: string | null;
  subtotal: number;
  discount: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  created_at: string;
};

/**
 * Type representing an InvoiceItem in the database.
 */
export type InvoiceItem = {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  created_at: string;
};

/**
 * Type representing an Invoice with associated client information.
 */
export type InvoiceWithClient = Invoice & {
  clients: { address: string };
};

// Test database connection
/**
 * Tests the database connection by querying the invoices table.
 * @returns {Promise<{ success: boolean, message: string }>} An object indicating success and a message.
 */
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("count")
      .limit(1);
    if (error) throw error;
    return { success: true, message: "Database connection successful" };
  } catch (error) {
    console.error("Database connection failed:", error);
    return {
      success: false,
      message: `Database connection failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}