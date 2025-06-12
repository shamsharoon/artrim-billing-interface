"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { type Client, type Invoice, type InvoiceItem, createInvoice, updateInvoice } from "@/lib/supabase"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus } from "lucide-react"

// Form schema
const invoiceSchema = z.object({
  client_id: z.string().min(1, { message: "Client is required" }),
  project_name: z.string().min(1, { message: "Project name is required" }),
  project_number: z.string().min(1, { message: "Project number is required" }),
  invoice_number: z.string().min(1, { message: "Invoice number is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  payment_condition: z.string().min(1, { message: "Payment condition is required" }),
  note: z.string().optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1, { message: "Description is required" }),
        quantity: z.number().min(0.01, { message: "Quantity must be greater than 0" }),
        unit_price: z.number().min(0.01, { message: "Unit price must be greater than 0" }),
      }),
    )
    .min(1, { message: "At least one item is required" }),
  discount: z.number().min(0, { message: "Discount cannot be negative" }).default(0),
  tax_rate: z.number().min(0, { message: "Tax rate cannot be negative" }).default(13),
})

type InvoiceFormValues = z.infer<typeof invoiceSchema>

interface InvoiceFormProps {
  clients: Client[]
  existingInvoice?: Invoice
  existingItems?: InvoiceItem[]
  onSuccess?: (id: string) => void
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ clients, existingInvoice, existingItems = [], onSuccess }) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subtotal, setSubtotal] = useState(0)
  const [discount, setDiscount] = useState(existingInvoice?.discount || 0)
  const [taxRate, setTaxRate] = useState(existingInvoice?.tax_rate || 13)
  const [taxAmount, setTaxAmount] = useState(0)
  const [total, setTotal] = useState(0)

  // Initialize form with existing data or defaults
  const defaultValues: InvoiceFormValues = {
    client_id: existingInvoice?.client_id || "",
    project_name: existingInvoice?.project_name || "",
    project_number: existingInvoice?.project_number || "",
    invoice_number: existingInvoice?.invoice_number || "",
    date: existingInvoice?.date || new Date().toISOString().split("T")[0],
    payment_condition: existingInvoice?.payment_condition || "According to the percentage of jobs completed",
    note: existingInvoice?.note || "Material not included! Labor only.",
    items:
      existingItems.length > 0
        ? existingItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
          }))
        : [{ description: "", quantity: 1, unit_price: 0 }],
    discount: existingInvoice?.discount || 0,
    tax_rate: existingInvoice?.tax_rate || 13,
  }

  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  // Watch for changes to calculate totals
  const watchItems = watch("items")
  const watchDiscount = watch("discount")
  const watchTaxRate = watch("tax_rate")

  // Calculate totals when items, discount, or tax rate change
  useEffect(() => {
    const calculatedSubtotal = watchItems.reduce((sum, item) => {
      const lineTotal = (item.quantity || 0) * (item.unit_price || 0)
      return sum + lineTotal
    }, 0)

    const calculatedDiscount = watchDiscount || 0
    const discountedSubtotal = calculatedSubtotal - calculatedDiscount
    const calculatedTaxAmount = discountedSubtotal * (watchTaxRate / 100)
    const calculatedTotal = discountedSubtotal + calculatedTaxAmount

    setSubtotal(calculatedSubtotal)
    setDiscount(calculatedDiscount)
    setTaxRate(watchTaxRate)
    setTaxAmount(calculatedTaxAmount)
    setTotal(calculatedTotal)
  }, [watchItems, watchDiscount, watchTaxRate])

  const onSubmit = async (data: InvoiceFormValues) => {
    setIsSubmitting(true)

    try {
      // Calculate line totals for each item
      const itemsWithTotals = data.items.map((item) => ({
        ...item,
        line_total: item.quantity * item.unit_price,
      }))

      // Prepare invoice data
      const invoiceData = {
        client_id: data.client_id,
        project_name: data.project_name,
        project_number: data.project_number,
        invoice_number: data.invoice_number,
        date: data.date,
        payment_condition: data.payment_condition,
        note: data.note || "",
        subtotal,
        discount: data.discount,
        tax_rate: data.tax_rate,
        tax_amount: taxAmount,
        total,
      }

      let invoiceId

      if (existingInvoice) {
        // Update existing invoice
        invoiceId = await updateInvoice(existingInvoice.id, invoiceData, itemsWithTotals)
      } else {
        // Create new invoice
        invoiceId = await createInvoice(invoiceData as any, itemsWithTotals as any)
      }

      if (onSuccess) {
        onSuccess(invoiceId)
      } else {
        router.push(`/invoices/${invoiceId}`)
      }
    } catch (error) {
      console.error("Error saving invoice:", error)
      alert("Failed to save invoice. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-8">
        {/* Client and Project Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client & Project Information</CardTitle>
            <CardDescription>Enter the client and project details for this invoice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_id">Client</Label>
                <Controller
                  name="client_id"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="client_id">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.client_id && <p className="text-sm text-red-500">{errors.client_id.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_name">Project Name</Label>
                <Input
                  id="project_name"
                  {...register("project_name")}
                  placeholder="44 Cameron Ave, North York, ON M2N 1E1"
                />
                {errors.project_name && <p className="text-sm text-red-500">{errors.project_name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_number">Project Number</Label>
                <Input id="project_number" {...register("project_number")} placeholder="JOB#346-2517" />
                {errors.project_number && <p className="text-sm text-red-500">{errors.project_number.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoice_number">Invoice Number</Label>
                <Input id="invoice_number" {...register("invoice_number")} placeholder="1747" />
                {errors.invoice_number && <p className="text-sm text-red-500">{errors.invoice_number.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" {...register("date")} />
                {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_condition">Payment Condition</Label>
              <Input
                id="payment_condition"
                {...register("payment_condition")}
                placeholder="According to the percentage of jobs completed"
              />
              {errors.payment_condition && <p className="text-sm text-red-500">{errors.payment_condition.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea id="note" {...register("note")} placeholder="Material not included! Labor only." />
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
            <CardDescription>Add the services or products for this invoice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 font-medium text-sm border-b pb-2">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Unit Price</div>
                <div className="col-span-2 text-right">Line Total</div>
              </div>

              {/* Line Items */}
              {fields.map((field, index) => {
                const lineTotal = (watchItems[index]?.quantity || 0) * (watchItems[index]?.unit_price || 0)

                return (
                  <div key={field.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-6">
                      <Input
                        {...register(`items.${index}.description` as const)}
                        placeholder="Installation of interior doors with casing, lockset and hinges"
                      />
                      {errors.items?.[index]?.description && (
                        <p className="text-xs text-red-500">{errors.items[index]?.description?.message}</p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <Input
                        type="number"
                        step="1"
                        min="1"
                        {...register(`items.${index}.quantity` as const, {
                          valueAsNumber: true,
                        })}
                        className="text-center"
                      />
                      {errors.items?.[index]?.quantity && (
                        <p className="text-xs text-red-500">{errors.items[index]?.quantity?.message}</p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register(`items.${index}.unit_price` as const, {
                          valueAsNumber: true,
                        })}
                        className="text-center"
                      />
                      {errors.items?.[index]?.unit_price && (
                        <p className="text-xs text-red-500">{errors.items[index]?.unit_price?.message}</p>
                      )}
                    </div>

                    <div className="col-span-1 text-right">{formatCurrency(lineTotal)}</div>

                    <div className="col-span-1 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ description: "", quantity: 1, unit_price: 0 })}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="subtotal">Subtotal</Label>
                <div className="text-right font-medium">{formatCurrency(subtotal)}</div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Label htmlFor="discount">Discount</Label>
                  <Input
                    id="discount"
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-24"
                    {...register("discount", { valueAsNumber: true })}
                  />
                </div>
                <div className="text-right font-medium">{formatCurrency(discount)}</div>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center">
                  <Label>Discounted Subtotal</Label>
                  <div className="text-right font-medium">{formatCurrency(subtotal - discount)}</div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Label htmlFor="tax_rate">HST (%)</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-16"
                    {...register("tax_rate", { valueAsNumber: true })}
                  />
                </div>
                <div className="text-right font-medium">{formatCurrency(taxAmount)}</div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <Label className="text-lg font-bold text-emerald-600">TOTAL</Label>
                <div className="text-right text-lg font-bold text-emerald-600">{formatCurrency(total)}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.push("/invoices")} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : existingInvoice ? "Update Invoice" : "Create Invoice"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}

export default InvoiceForm
