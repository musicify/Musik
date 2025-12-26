"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Search,
  Calendar,
  Euro,
  Eye,
  Filter,
  ChevronDown,
  Check,
  X,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Mock invoices data
const invoices = [
  {
    id: "INV-2024-0047",
    date: "2024-01-22",
    items: ["Neon Dreams", "Epic Horizon"],
    amount: 473.62,
    status: "PAID",
    type: "marketplace",
  },
  {
    id: "INV-2024-0046",
    date: "2024-01-20",
    items: ["Corporate Video Soundtrack (Anzahlung)"],
    amount: 135.0,
    status: "PAID",
    type: "custom",
  },
  {
    id: "INV-2024-0045",
    date: "2024-01-15",
    items: ["Podcast Intro Music"],
    amount: 333.20,
    status: "PENDING",
    type: "custom",
  },
  {
    id: "INV-2024-0044",
    date: "2024-01-10",
    items: ["Urban Flow"],
    amount: 46.41,
    status: "PAID",
    type: "marketplace",
  },
  {
    id: "INV-2024-0043",
    date: "2024-01-05",
    items: ["YouTube Channel Intro"],
    amount: 214.20,
    status: "PAID",
    type: "custom",
  },
  {
    id: "INV-2023-0142",
    date: "2023-12-28",
    items: ["Wedding Video Music"],
    amount: 380.80,
    status: "PAID",
    type: "custom",
  },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Check }> = {
  PAID: { label: "Bezahlt", color: "text-green-500", bgColor: "bg-green-500/20", icon: Check },
  PENDING: { label: "Ausstehend", color: "text-yellow-500", bgColor: "bg-yellow-500/20", icon: Clock },
  OVERDUE: { label: "Überfällig", color: "text-red-500", bgColor: "bg-red-500/20", icon: X },
  CANCELLED: { label: "Storniert", color: "text-gray-500", bgColor: "bg-gray-500/20", icon: X },
};

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.items.some((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    const matchesType = typeFilter === "all" || invoice.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPaid = invoices
    .filter((i) => i.status === "PAID")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPending = invoices
    .filter((i) => i.status === "PENDING")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-4xl mb-2">Rechnungen</h1>
          <p className="text-muted-foreground">
            {invoices.length} Rechnungen insgesamt
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-3 gap-4 mb-8"
        >
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-serif">{invoices.length}</p>
                <p className="text-sm text-muted-foreground">Rechnungen</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-serif">€{totalPaid.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Bezahlt</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-serif">€{totalPending.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Ausstehend</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Suche nach Rechnungsnummer oder Artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="PAID">Bezahlt</SelectItem>
              <SelectItem value="PENDING">Ausstehend</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Typ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Typen</SelectItem>
              <SelectItem value="marketplace">Marktplatz</SelectItem>
              <SelectItem value="custom">Custom Music</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Invoices Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card/50 border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rechnungsnr.</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Artikel</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Betrag</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="font-medium mb-1">Keine Rechnungen gefunden</p>
                      <p className="text-sm text-muted-foreground">
                        Versuche andere Filter oder Suchbegriffe
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => {
                    const status = statusConfig[invoice.status];
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>
                          {new Date(invoice.date).toLocaleDateString("de-DE")}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate">
                            {invoice.items.join(", ")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {invoice.type === "marketplace" ? "Marktplatz" : "Custom"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${status.bgColor} ${status.color} border-0`}>
                            <status.icon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          €{invoice.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
