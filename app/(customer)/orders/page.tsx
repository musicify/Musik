"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  ChevronRight,
  Search,
  Filter,
  Music,
  MessageSquare,
  Calendar,
  Euro,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Mock orders data
const orders = [
  {
    id: "ORD-2024-003",
    title: "Corporate Video Soundtrack",
    description: "Energetischer Soundtrack für Unternehmensvideo, 2-3 Minuten",
    status: "IN_PROGRESS",
    director: {
      id: "dir1",
      name: "Max Müller",
      avatar: "from-violet-500 to-purple-600",
    },
    price: 450,
    createdAt: "2024-01-20",
    deadline: "2024-02-05",
    progress: 60,
    revisions: { used: 1, total: 3 },
    messages: 8,
  },
  {
    id: "ORD-2024-002",
    title: "Podcast Intro Music",
    description: "Kurzes, einprägsames Intro für Tech-Podcast",
    status: "REVISION_REQUESTED",
    director: {
      id: "dir2",
      name: "Sarah Schmidt",
      avatar: "from-amber-500 to-yellow-500",
    },
    price: 280,
    createdAt: "2024-01-15",
    deadline: "2024-01-30",
    progress: 80,
    revisions: { used: 2, total: 3 },
    messages: 12,
  },
  {
    id: "ORD-2024-001",
    title: "YouTube Channel Intro",
    description: "Modernes Intro für Gaming YouTube Kanal",
    status: "COMPLETED",
    director: {
      id: "dir3",
      name: "Tom Weber",
      avatar: "from-cyan-500 to-teal-500",
    },
    price: 180,
    createdAt: "2024-01-05",
    deadline: "2024-01-15",
    progress: 100,
    revisions: { used: 1, total: 2 },
    messages: 6,
  },
  {
    id: "ORD-2023-015",
    title: "Wedding Video Music",
    description: "Romantischer Soundtrack für Hochzeitsvideo",
    status: "COMPLETED",
    director: {
      id: "dir4",
      name: "Lisa Braun",
      avatar: "from-rose-500 to-orange-400",
    },
    price: 320,
    createdAt: "2023-12-10",
    deadline: "2023-12-28",
    progress: 100,
    revisions: { used: 0, total: 2 },
    messages: 4,
  },
  {
    id: "ORD-2024-004",
    title: "App Notification Sounds",
    description: "Set von 5 kurzen Notification Sounds für Mobile App",
    status: "PENDING",
    director: {
      id: "dir6",
      name: "Nina Hofmann",
      avatar: "from-emerald-500 to-teal-600",
    },
    price: 150,
    createdAt: "2024-01-22",
    deadline: null,
    progress: 0,
    revisions: { used: 0, total: 2 },
    messages: 2,
  },
];

const statusConfig: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  PENDING: {
    label: "Wartet auf Angebot",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/20",
  },
  OFFER_PENDING: {
    label: "Angebot erhalten",
    color: "text-blue-500",
    bgColor: "bg-blue-500/20",
  },
  OFFER_ACCEPTED: {
    label: "Angenommen",
    color: "text-green-500",
    bgColor: "bg-green-500/20",
  },
  IN_PROGRESS: {
    label: "In Bearbeitung",
    color: "text-blue-500",
    bgColor: "bg-blue-500/20",
  },
  REVISION_REQUESTED: {
    label: "Revision angefragt",
    color: "text-orange-500",
    bgColor: "bg-orange-500/20",
  },
  READY_FOR_PAYMENT: {
    label: "Bereit zur Zahlung",
    color: "text-purple-500",
    bgColor: "bg-purple-500/20",
  },
  COMPLETED: {
    label: "Abgeschlossen",
    color: "text-green-500",
    bgColor: "bg-green-500/20",
  },
  CANCELLED: {
    label: "Storniert",
    color: "text-red-500",
    bgColor: "bg-red-500/20",
  },
};

function OrderCard({ order }: { order: (typeof orders)[0] }) {
  const status = statusConfig[order.status];

  return (
    <Link href={`/orders/${order.id}`}>
      <Card className="bg-card/50 border-border/50 hover:border-border transition-colors cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Director Avatar */}
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${order.director.avatar} flex items-center justify-center text-white font-serif flex-shrink-0`}
            >
              {order.director.name.charAt(0)}
            </div>

            {/* Order Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="font-semibold">{order.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.director.name} · {order.id}
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
              {order.status !== "COMPLETED" &&
                order.status !== "PENDING" &&
                order.status !== "CANCELLED" && (
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
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {order.messages}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  Revisionen: {order.revisions.used}/{order.revisions.total}
                </span>
                <span className="font-medium text-primary ml-auto">
                  €{order.price}
                </span>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("active");

  const activeOrders = orders.filter(
    (o) =>
      o.status !== "COMPLETED" &&
      o.status !== "CANCELLED"
  );
  const completedOrders = orders.filter(
    (o) => o.status === "COMPLETED" || o.status === "CANCELLED"
  );

  const filteredOrders = (
    activeTab === "active" ? activeOrders : completedOrders
  ).filter((order) => {
    const matchesSearch =
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-serif text-4xl mb-2">Meine Aufträge</h1>
            <p className="text-muted-foreground">
              {activeOrders.length} aktive Aufträge, {completedOrders.length}{" "}
              abgeschlossen
            </p>
          </div>
          <Link href="/custom-music">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Package className="w-4 h-4 mr-2" />
              Neuer Auftrag
            </Button>
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Suche nach Titel oder Auftragsnummer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Status filtern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="PENDING">Wartet auf Angebot</SelectItem>
              <SelectItem value="IN_PROGRESS">In Bearbeitung</SelectItem>
              <SelectItem value="REVISION_REQUESTED">Revision</SelectItem>
              <SelectItem value="READY_FOR_PAYMENT">Bereit zur Zahlung</SelectItem>
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
                  <p className="text-muted-foreground mb-4">
                    Erstelle einen neuen Auftrag für maßgeschneiderte Musik.
                  </p>
                  <Link href="/custom-music">
                    <Button>Neuen Auftrag erstellen</Button>
                  </Link>
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
