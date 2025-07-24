import type React from "react";
import {
  Document,
} from "@react-pdf/renderer";
import type { Invoice, InvoiceItem } from "@/lib/supabase";
import InvoicePdfPage from './InvoicePdfContent';
import { formatCurrency } from './InvoicePdfUtils';

interface InvoicePdfProps {
  invoice: Invoice & { clients: { address: string } };
  items: InvoiceItem[];
}

const InvoicePdf: React.FC<InvoicePdfProps> = ({ invoice, items }) => {
  return (
    <Document>
      <InvoicePdfPage invoice={invoice} items={items} />
    </Document>
  );
};

export default InvoicePdf;