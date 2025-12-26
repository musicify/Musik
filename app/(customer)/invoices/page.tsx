"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Download,
  Eye,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock invoices
const mockInvoices = [
  {
    id: "INV-2024-00123",
    date: "2024-01-05",
    dueDate: "2024-01-19",
    items: [
      { title: "Neon Dreams", license: "COMMERCIAL", price: 79.99 },
      { title: "Corporate Success", license: "PERSONAL", price: 29.99 },
    ],
    subtotal: 109.98,
    tax: 20.90,
    total: 130.88,
    status: "PAID",
    paidAt: "2024-01-05",
  },
  {
    id: "INV-2024-00089",
    date: "2024-01-01",
    dueDate: "2024-01-15",
    items: [
      { title: "Epic Cinematic Trailer (Custom)", license: "COMMERCIAL", price: 450.00 },
    ],
    subtotal: 450.00,
    tax: 85.50,
    total: 535.50,
    status: "PAID",
    paidAt: "2024-01-02",
  },
  {
    id: "INV-2023-00456",
    date: "2023-12-20",
    dueDate: "2024-01-03",
    items: [
      { title: "Brand Jingle (Custom)", license: "EXCLUSIVE", price: 800.00 },
    ],
    subtotal: 800.00,
    tax: 152.00,
    total: 952.00,
    status: "PAID",
    paidAt: "2023-12-21",
  },
];

const statusConfig = {
  PAID: {
    label: "Bezahlt",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    icon: CheckCircle2,
  },
  UNPAID: {
    label: "Offen",
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    icon: Clock,
  },
  OVERDUE: {
    label: "Überfällig",
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: AlertCircle,
  },
};

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter invoices
  const filteredInvoices = mockInvoices.filter((invoice) => {
    if (statusFilter !== "all" && invoice.status !== statusFilter) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !invoice.id.toLowerCase().includes(query) &&
        !invoice.items.some((item) => item.title.toLowerCase().includes(query))
      ) {
        return false;
      }
    }
    return true;
  });

  // Calculate totals
  const totalSpent = mockInvoices
    .filter((i) => i.status === "PAID")
    .reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl mb-2">Rechnungen</h1>
          <p className="text-muted-foreground">
            Alle deine Rechnungen und Lizenznachweise
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-serif">{mockInvoices.length}</p>
                <p className="text-sm text-muted-foreground">Rechnungen</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-serif">
                  {mockInvoices.filter((i) => i.status === "PAID").length}
                </p>
                <p className="text-sm text-muted-foreground">Bezahlt</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-serif">€{totalSpent.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Gesamtausgaben</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-1 w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechnung suchen..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="PAID">Bezahlt</SelectItem>
                  <SelectItem value="UNPAID">Offen</SelectItem>
                  <SelectItem value="OVERDUE">Überfällig</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card className="bg-card border-border/50">
          <CardContent className="p-0">
            {filteredInvoices.length === 0 ? (
              <div className="py-16 text-center">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">Keine Rechnungen gefunden</h3>
                <p className="text-muted-foreground">
                  {mockInvoices.length === 0
                    ? "Du hast noch keine Rechnungen"
                    : "Versuche andere Filter"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rechnungsnr.</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>Artikel</TableHead>
                    <TableHead className="text-right">Betrag</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice, index) => {
                    const status = statusConfig[invoice.status as keyof typeof statusConfig];
                    const StatusIcon = status.icon;

                    return (
                      <motion.tr
                        key={invoice.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <TableCell>
                          <span className="font-mono font-medium">{invoice.id}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(invoice.date).toLocaleDateString("de-DE")}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            {invoice.items.map((item, i) => (
                              <div key={i} className="text-sm">
                                <span className="font-medium">{item.title}</span>
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  {item.license}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <p className="font-medium">€{invoice.total.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">
                              inkl. €{invoice.tax.toFixed(2)} MwSt.
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={status.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Ansehen
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

