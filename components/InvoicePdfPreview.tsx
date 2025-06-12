import type React from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import InvoicePdf from "./InvoicePdf";
import type { Invoice, InvoiceItem } from "@/lib/supabase";
import { useState, useEffect } from "react";

interface InvoicePdfPreviewProps {
  invoice: Invoice & { clients: { name: string; address: string } };
  items: InvoiceItem[];
}

const InvoicePdfPreview: React.FC<InvoicePdfPreviewProps> = ({
  invoice,
  items,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>PDF Preview</CardTitle>
        {isClient && (
          <PDFDownloadLink
            document={<InvoicePdf invoice={invoice} items={items} />}
            fileName={`invoice-${invoice.invoice_number}.pdf`}
          >
            {({ loading }) => (
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
              >
                <Download className="h-4 w-4 mr-2" />
                {loading ? "Generating PDF..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        )}
      </CardHeader>
      <CardContent>
        <div className="w-full h-[800px] border rounded-md overflow-hidden">
          {isClient ? (
            <PDFViewer width="100%" height="100%" className="w-full h-full">
              <InvoicePdf invoice={invoice} items={items} />
            </PDFViewer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-gray-500">
                Loading PDF preview...
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicePdfPreview;
