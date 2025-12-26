"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  ChevronRight,
  Search,
  MessageSquare,
  Calendar,
  Euro,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock orders data (from director perspective)
const orders = [
  {
    id: "ORD-2024-003",
    title: "Corporate Video Soundtrack",
    description: "Energetischer Soundtrack für Unternehmensvideo, 2-3 Minuten",
    status: "IN_PROGRESS",
    customer: "Max Mustermann",
    company: "TechStart GmbH",
    price: 450,
    createdAt: "2024-01-20",
    deadline: "2024-02-05",
    progress: 60,
    revisions: { used: 1, total: 3 },
    messages: 3,
    isNew: false,
  },
  {
    id: "ORD-2024-004",
    title: "App Notification Sounds",
    description: "Set von 5 kurzen Notification Sounds für Mobile App",
    status: "PENDING",
    customer: "Lisa Schmidt",
    company: "AppDev Solutions",
    price: null,
    createdAt: "2024-01-22",
    deadline: null,
    progress: 0,
    revisions: { used: 0, total: 2 },
    messages: 2,
    isNew: true,
  },
  {
    id: "ORD-2024-005",
    title: "Podcast Intro Jingle",
    description: "Kurzes, einprägsames Jingle für Tech-Podcast",
    status: "REVISION_REQUESTED",
    customer: "Michael Weber",
    company: null,
    price: 280,
    createdAt: "2024-01-18",
    deadline: "2024-02-10",
    progress: 85,
    revisions: { used: 2, total: 3 },
    messages: 7,
    isNew: false,
  },
  {
    id: "ORD-2024-002",
    title: "Wedding Video Music",
    description: "Romantischer Soundtrack für Hochzeitsvideo",
    status: "COMPLETED",
    customer: "Anna Müller",
    company: null,
    price: 320,
    createdAt: "2023-12-10",
    deadline: "2023-12-28",
    progress: 100,
    revisions: { used: 0, total: 2 },
    messages: 4,
    isNew: false,
  },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: "Neue Anfrage", color: "text-yellow-500", bgColor: "bg-yellow-500/20" },
  OFFER_SENT: { label: "Angebot gesendet", color: "text-blue-500", bgColor: "bg-blue-500/20" },
  IN_PROGRESS: { label: "In Bearbeitung", color: "text-blue-500", bgColor: "bg-blue-500/20" },
  REVISION_REQUESTED: { label: "Revision angefragt", color: "text-orange-500", bgColor: "bg-orange-500/20" },
  READY_FOR_REVIEW: { label: "Zur Abnahme", color: "text-purple-500", bgColor: "bg-purple-500/20" },
  COMPLETED: { label: "Abgeschlossen", color: "text-green-500", bgColor: "bg-green-500/20" },
  CANCELLED: { label: "Storniert", color: "text-red-500", bgColor: "bg-red-500/20" },
};

function OrderCard({ order }: { order: (typeof orders)[0] }) {
  const status = statusConfig[order.status];

  return (
    <Card className="bg-card/50 border-border/50 hover:border-border transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{order.title}</h3>
                  {order.isNew && (
                    <Badge className="bg-primary text-primary-foreground">Neu</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.customer}
                  {order.company && ` · ${order.company}`} · {order.id}
                </p>
              </div>
              <Badge className={`${status.bgColor} ${status.color} border-0`}>
                {status.label}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
              {order.description}
            </p>

            {/* Progress Bar (for active orders) */}
            {order.progress > 0 && order.status !== "COMPLETED" && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Fortschritt</span>
                  <span>{order.progress}%</span>
                </div>
                <Progress value={order.progress} className="h-2" />
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(order.createdAt).toLocaleDateString("de-DE")}
              </span>
              {order.deadline && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  Deadline: {new Date(order.deadline).toLocaleDateString("de-DE")}
                </span>
              )}
              {order.messages > 0 && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {order.messages} Nachrichten
                </span>
              )}
              {order.price ? (
                <span className="font-medium text-primary ml-auto">€{order.price}</span>
              ) : (
                <Badge variant="outline" className="ml-auto">Angebot ausstehend</Badge>
              )}
            </div>
          </div>

          <Link href={`/director/orders/${order.id}`}>
            <Button variant="secondary" size="sm">
              {order.status === "PENDING" ? "Angebot erstellen" : "Details"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DirectorOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("active");

  const activeOrders = orders.filter(
    (o) => o.status !== "COMPLETED" && o.status !== "CANCELLED"
  );
  const completedOrders = orders.filter(
    (o) => o.status === "COMPLETED" || o.status === "CANCELLED"
  );
  const newRequests = orders.filter((o) => o.status === "PENDING");

  const filteredOrders = (
    activeTab === "active" ? activeOrders : completedOrders
  ).filter((order) => {
    const matchesSearch =
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalEarnings = orders
    .filter((o) => o.status === "COMPLETED" && o.price)
    .reduce((sum, o) => sum + (o.price || 0), 0);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-4xl mb-2">Aufträge</h1>
          <p className="text-muted-foreground">
            {activeOrders.length} aktive Aufträge · {newRequests.length} neue Anfragen
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="p-6 flex items-center gap-4">
              <AlertCircle className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-serif">{newRequests.length}</p>
                <p className="text-sm text-muted-foreground">Neue Anfragen</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-6 flex items-center gap-4">
              <Package className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-serif">{activeOrders.length}</p>
                <p className="text-sm text-muted-foreground">In Bearbeitung</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-6 flex items-center gap-4">
              <Check className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-serif">{completedOrders.length}</p>
                <p className="text-sm text-muted-foreground">Abgeschlossen</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6 flex items-center gap-4">
              <Euro className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-serif">€{totalEarnings}</p>
                <p className="text-sm text-muted-foreground">Verdient</p>
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
              placeholder="Suche nach Titel, Kunde oder Auftragsnummer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status filtern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="PENDING">Neue Anfragen</SelectItem>
              <SelectItem value="IN_PROGRESS">In Bearbeitung</SelectItem>
              <SelectItem value="REVISION_REQUESTED">Revision</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-card/50">
            <TabsTrigger value="active">
              Aktiv ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Abgeschlossen ({completedOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card className="bg-card/50 border-border/50">
                <CardContent className="py-16 text-center">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Keine aktiven Aufträge
                  </h3>
                  <p className="text-muted-foreground">
                    Neue Kundenanfragen erscheinen hier.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <OrderCard order={order} />
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card className="bg-card/50 border-border/50">
                <CardContent className="py-16 text-center">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Keine abgeschlossenen Aufträge
                  </h3>
                  <p className="text-muted-foreground">
                    Abgeschlossene Aufträge werden hier angezeigt.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <OrderCard order={order} />
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
