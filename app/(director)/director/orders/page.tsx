"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Clock,
  MessageSquare,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Timer,
  DollarSign,
  Music,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock orders
const mockOrders = [
  {
    id: "ord1",
    title: "Epic Cinematic Trailer",
    customer: { name: "Film Studio ABC", initials: "FS" },
    status: "IN_PROGRESS",
    budget: 450,
    deadline: "2024-01-15",
    daysLeft: 12,
    unreadMessages: 2,
    createdAt: "2024-01-01",
    genre: "Cinematic",
    description: "Brauche einen epischen Trailer-Track für einen Action-Film.",
  },
  {
    id: "ord2",
    title: "Corporate Brand Jingle",
    customer: { name: "TechCorp GmbH", initials: "TC" },
    status: "OFFER_PENDING",
    budget: 300,
    deadline: null,
    daysLeft: null,
    unreadMessages: 0,
    createdAt: "2024-01-03",
    genre: "Corporate",
    description: "Kurzer, einprägsamer Jingle für Werbespots.",
  },
  {
    id: "ord3",
    title: "Meditation Music Pack",
    customer: { name: "Wellness App", initials: "WA" },
    status: "REVISION_REQUESTED",
    budget: 600,
    deadline: "2024-01-20",
    daysLeft: 5,
    unreadMessages: 3,
    createdAt: "2024-01-02",
    genre: "Ambient",
    description: "5 entspannende Tracks für eine Meditations-App.",
  },
  {
    id: "ord4",
    title: "Electronic Dance Track",
    customer: { name: "DJ Max", initials: "DM" },
    status: "READY_FOR_PAYMENT",
    budget: 250,
    deadline: "2024-01-10",
    daysLeft: 0,
    unreadMessages: 0,
    createdAt: "2024-01-04",
    genre: "Electronic",
    description: "EDM Track für Club-Sets und Festivals.",
  },
  {
    id: "ord5",
    title: "Podcast Intro/Outro",
    customer: { name: "Podcast Pro", initials: "PP" },
    status: "COMPLETED",
    budget: 150,
    deadline: "2024-01-05",
    daysLeft: null,
    unreadMessages: 0,
    createdAt: "2023-12-20",
    genre: "Pop",
    description: "Professionelles Intro und Outro für Tech-Podcast.",
  },
];

const statusConfig = {
  PENDING: { label: "Ausstehend", color: "status-pending", icon: Clock },
  OFFER_PENDING: { label: "Angebot ausstehend", color: "status-pending", icon: Timer },
  OFFER_ACCEPTED: { label: "Angebot akzeptiert", color: "status-in-progress", icon: CheckCircle2 },
  IN_PROGRESS: { label: "In Bearbeitung", color: "status-in-progress", icon: Music },
  REVISION_REQUESTED: { label: "Revision angefragt", color: "status-revision", icon: AlertCircle },
  READY_FOR_PAYMENT: { label: "Bereit zur Zahlung", color: "status-ready", icon: DollarSign },
  PAID: { label: "Bezahlt", color: "status-paid", icon: CheckCircle2 },
  COMPLETED: { label: "Abgeschlossen", color: "status-completed", icon: CheckCircle2 },
  CANCELLED: { label: "Storniert", color: "status-cancelled", icon: XCircle },
  DISPUTED: { label: "Streitfall", color: "status-disputed", icon: AlertCircle },
};

function OrderCard({ order }: { order: (typeof mockOrders)[0] }) {
  const status = statusConfig[order.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  return (
    <Link href={`/director/orders/${order.id}`}>
      <Card className="bg-card border-border/50 hover:border-border transition-all card-hover">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-br from-primary/30 to-secondary/30">
                  {order.customer.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{order.title}</h3>
                  {order.unreadMessages > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {order.unreadMessages}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {order.customer.name} • {order.genre}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {order.description}
                </p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-2">
              <Badge className={status.color}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </Badge>
              <p className="text-lg font-serif">€{order.budget}</p>
              {order.daysLeft !== null && order.daysLeft > 0 && (
                <p className="text-xs text-muted-foreground">
                  {order.daysLeft} Tage übrig
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(order.createdAt).toLocaleDateString("de-DE")}
              </span>
              {order.deadline && (
                <span className="flex items-center gap-1">
                  <Timer className="w-4 h-4" />
                  Fällig: {new Date(order.deadline).toLocaleDateString("de-DE")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <MessageSquare className="w-4 h-4 mr-1" />
                Chat
              </Button>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DirectorOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentTab, setCurrentTab] = useState("all");

  // Filter orders
  const filteredOrders = mockOrders.filter((order) => {
    // Tab filter
    if (currentTab === "active") {
      if (!["IN_PROGRESS", "REVISION_REQUESTED", "OFFER_PENDING", "OFFER_ACCEPTED"].includes(order.status)) {
        return false;
      }
    } else if (currentTab === "completed") {
      if (!["COMPLETED", "PAID", "READY_FOR_PAYMENT"].includes(order.status)) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !order.title.toLowerCase().includes(query) &&
        !order.customer.name.toLowerCase().includes(query) &&
        !order.genre.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    return true;
  });

  // Stats
  const activeOrders = mockOrders.filter((o) =>
    ["IN_PROGRESS", "REVISION_REQUESTED", "OFFER_PENDING"].includes(o.status)
  ).length;
  const pendingPayments = mockOrders.filter((o) => o.status === "READY_FOR_PAYMENT").length;
  const totalUnread = mockOrders.reduce((sum, o) => sum + o.unreadMessages, 0);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl mb-2">Meine Aufträge</h1>
          <p className="text-muted-foreground">
            Verwalte deine Kundenaufträge und kommuniziere mit deinen Kunden
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-serif">{activeOrders}</p>
                <p className="text-sm text-muted-foreground">Aktive Aufträge</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-serif">{pendingPayments}</p>
                <p className="text-sm text-muted-foreground">Zahlungen ausstehend</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-serif">{totalUnread}</p>
                <p className="text-sm text-muted-foreground">Ungelesene Nachrichten</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList>
                  <TabsTrigger value="all">Alle</TabsTrigger>
                  <TabsTrigger value="active">Aktiv</TabsTrigger>
                  <TabsTrigger value="completed">Abgeschlossen</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Suchen..."
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
                    {Object.entries(statusConfig).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="bg-card border-border/50">
            <CardContent className="py-16 text-center">
              <Music className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium mb-2">Keine Aufträge gefunden</h3>
              <p className="text-muted-foreground mb-4">
                Versuche andere Filter oder Suchbegriffe
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setCurrentTab("all");
                }}
              >
                Filter zurücksetzen
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

