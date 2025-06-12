import type React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Invoice, InvoiceItem } from "@/lib/supabase";

// Using built-in fonts to avoid loading issues

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  contactsContainer: {
    width: "50%",
  },
  contactsHeader: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#10b981",
  },
  contactInfo: {
    fontSize: 10,
    marginBottom: 2,
  },
  projectInfoContainer: {
    width: "50%",
    alignItems: "flex-end",
  },
  projectInfoRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 5,
  },
  projectInfoLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginRight: 10,
    width: 100,
    textAlign: "right",
  },
  projectInfoValue: {
    fontSize: 10,
    width: 150,
  },
  paymentSection: {
    marginTop: 10,
    marginBottom: 10,
    borderTop: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
    paddingTop: 10,
    paddingBottom: 10,
  },
  paymentLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginRight: 5,
  },
  paymentValue: {
    fontSize: 10,
  },
  noteText: {
    fontSize: 10,
    marginTop: 5,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#10b981",
    borderBottomStyle: "solid",
    backgroundColor: "#f9fafb",
    paddingVertical: 8,
    paddingHorizontal: 5,
    fontWeight: "bold",
    fontSize: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
    paddingVertical: 8,
    paddingHorizontal: 5,
    fontSize: 10,
  },
  alternateRow: {
    backgroundColor: "#f9fafb",
  },
  descriptionCol: {
    width: "55%",
  },
  qtyCol: {
    width: "15%",
    textAlign: "center",
  },
  priceCol: {
    width: "15%",
    textAlign: "right",
  },
  totalCol: {
    width: "15%",
    textAlign: "right",
  },
  summaryContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "bold",
    width: 100,
    textAlign: "right",
    marginRight: 10,
  },
  summaryValue: {
    fontSize: 10,
    width: 80,
    textAlign: "right",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#10b981",
    borderTopStyle: "solid",
    paddingTop: 5,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#10b981",
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#10b981",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    borderTopStyle: "solid",
  },
  signatureContainer: {
    width: "45%",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 10,
    textAlign: "center",
  },
});

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amount);
};

// PDF Document Component
interface InvoicePdfProps {
  invoice: Invoice & { clients: { name: string; address: string } };
  items: InvoiceItem[];
}

const InvoicePdf: React.FC<InvoicePdfProps> = ({ invoice, items }) => {
  const taxAmount = invoice.subtotal * (invoice.tax_rate / 100);
  const discountedSubtotal =
    invoice.discount > 0
      ? invoice.subtotal - invoice.discount
      : invoice.subtotal;
  const total = discountedSubtotal + taxAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with contacts */}
        <View style={styles.header}>
          <View style={styles.contactsContainer}>
            <Text style={styles.contactsHeader}>Contacts:</Text>
            <Text style={styles.contactInfo}>
              Haroon: (647) 886-3710, Haroon@artrim.ca
            </Text>
            <Text style={styles.contactInfo}>
              Amir: (647) 201-2020, Amir@artrim.ca
            </Text>
          </View>

          <View style={styles.projectInfoContainer}>
            <View style={styles.projectInfoRow}>
              <Text style={styles.projectInfoLabel}>Project name</Text>
              <Text style={styles.projectInfoValue}>
                {invoice.project_name}
              </Text>
            </View>
            <View style={styles.projectInfoRow}>
              <Text style={styles.projectInfoLabel}>Project number</Text>
              <Text style={styles.projectInfoValue}>
                {invoice.project_number}
              </Text>
            </View>
            <View style={styles.projectInfoRow}>
              <Text style={styles.projectInfoLabel}>Date</Text>
              <Text style={styles.projectInfoValue}>
                {new Date(invoice.date).toLocaleDateString("en-CA")}
              </Text>
            </View>
            <View style={styles.projectInfoRow}>
              <Text style={styles.projectInfoLabel}>No.</Text>
              <Text style={styles.projectInfoValue}>
                {invoice.invoice_number}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment conditions */}
        <View style={styles.paymentSection}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.paymentLabel}>Condition of payment</Text>
            <Text style={styles.paymentValue}>{invoice.payment_condition}</Text>
          </View>
          {invoice.note && (
            <Text style={styles.noteText}>Note: {invoice.note}</Text>
          )}
        </View>

        {/* Line items table */}
        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.descriptionCol}>Description</Text>
            <Text style={styles.qtyCol}>Qty</Text>
            <Text style={styles.priceCol}>Unit Price</Text>
            <Text style={styles.totalCol}>Line Total</Text>
          </View>

          {items.map((item, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index % 2 === 1 ? styles.alternateRow : {},
              ]}
            >
              <Text style={styles.descriptionCol}>{item.description}</Text>
              <Text style={styles.qtyCol}>{item.quantity}</Text>
              <Text style={styles.priceCol}>
                {formatCurrency(item.unit_price)}
              </Text>
              <Text style={styles.totalCol}>
                {formatCurrency(item.line_total)}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary section */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>SUBTOTAL:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(invoice.subtotal)}
            </Text>
          </View>

          {invoice.discount > 0 && (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>DISCOUNT:</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(invoice.discount)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>DISCOUNTED SUBTOTAL:</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(discountedSubtotal)}
                </Text>
              </View>
            </>
          )}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>HST:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(taxAmount)}</Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={[styles.summaryLabel, styles.totalLabel]}>TOTAL:</Text>
            <Text style={[styles.summaryValue, styles.totalValue]}>
              {formatCurrency(total)}
            </Text>
          </View>
        </View>

        {/* Footer with signatures */}
        <View style={styles.footer}>
          <View style={styles.signatureContainer}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Buyer</Text>
          </View>

          <View style={styles.signatureContainer}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Seller</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePdf;
