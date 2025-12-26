"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  MessageSquare,
  Clock,
  User,
  Package,
  RefreshCw,
  Filter,
  Search,
  ChevronRight,
  Send,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface Ticket {
  id: string;
  ticketNumber: string;
  type: string;
  status: string;
  subject: string;
  description: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  order?: {
    orderNumber: string;
    title: string;
  };
  messages: {
    id: string;
    content: string;
    isAdmin: boolean;
    createdAt: string;
  }[];
}

const mockTickets: Ticket[] = [
  {
    id: "1",
    ticketNumber: "TKT-2024-0001",
    type: "DISPUTE",
    status: "OPEN",
    subject: "Musik entspricht nicht der Beschreibung",
    description: "Die gelieferte Musik entspricht nicht dem, was im Angebot beschrieben wurde. Die Stimmung ist komplett anders und ich kann sie nicht für mein Projekt verwenden.",
    createdAt: "2024-01-21T09:00:00Z",
    user: {
      name: "Peter Meier",
      email: "peter@example.de",
    },
    order: {
      orderNumber: "ORD-2024-0042",
      title: "Corporate Video Soundtrack",
    },
    messages: [
      {
        id: "m1",
        content: "Die gelieferte Musik entspricht nicht dem, was im Angebot beschrieben wurde.",
        isAdmin: false,
        createdAt: "2024-01-21T09:00:00Z",
      },
    ],
  },
  {
    id: "2",
    ticketNumber: "TKT-2024-0002",
    type: "REFUND",
    status: "IN_PROGRESS",
    subject: "Rückerstattung für ungenutzten Track",
    description: "Ich habe versehentlich den falschen Track gekauft und möchte eine Rückerstattung beantragen. Der Track wurde noch nicht heruntergeladen.",
    createdAt: "2024-01-20T14:30:00Z",
    user: {
      name: "Maria Schulz",
      email: "maria@example.de",
    },
    messages: [
      {
        id: "m2",
        content: "Ich habe versehentlich den falschen Track gekauft.",
        isAdmin: false,
        createdAt: "2024-01-20T14:30:00Z",
      },
      {
        id: "m3",
        content: "Vielen Dank für Ihre Anfrage. Wir prüfen den Vorgang und melden uns in Kürze.",
        isAdmin: true,
        createdAt: "2024-01-20T15:00:00Z",
      },
    ],
  },
  {
    id: "3",
    ticketNumber: "TKT-2024-0003",
    type: "TECHNICAL",
    status: "OPEN",
    subject: "Download funktioniert nicht",
    description: "Wenn ich versuche meinen gekauften Track herunterzuladen, erhalte ich immer einen Fehler. Ich habe es mehrfach versucht.",
    createdAt: "2024-01-19T11:15:00Z",
    user: {
      name: "Thomas Klein",
      email: "thomas@example.de",
    },
    messages: [],
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Offen", color: "bg-yellow-500" },
  IN_PROGRESS: { label: "In Bearbeitung", color: "bg-blue-500" },
  RESOLVED: { label: "Gelöst", color: "bg-green-500" },
  CLOSED: { label: "Geschlossen", color: "bg-gray-500" },
};

const typeConfig: Record<string, { label: string; icon: typeof AlertTriangle }> = {
  DISPUTE: { label: "Streitfall", icon: AlertTriangle },
  REFUND: { label: "Rückerstattung", icon: XCircle },
  TECHNICAL: { label: "Technisch", icon: Package },
  GENERAL: { label: "Allgemein", icon: MessageSquare },
  OTHER: { label: "Sonstiges", icon: MessageSquare },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDisputesPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.user.name.toLowerCase().includes(search.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(search.toLowerCase());

    if (filter === "all") return matchesSearch;
    return matchesSearch && ticket.status === filter;
  });

  const openTickets = tickets.filter((t) => t.status === "OPEN").length;
  const inProgressTickets = tickets.filter((t) => t.status === "IN_PROGRESS").length;

  const handleSendMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newMsg = {
        id: `m${Date.now()}`,
        content: newMessage,
        isAdmin: true,
        createdAt: new Date().toISOString(),
      };

      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id
            ? { ...t, messages: [...t.messages, newMsg], status: "IN_PROGRESS" }
            : t
        )
      );

      setSelectedTicket((prev) =>
        prev
          ? { ...prev, messages: [...prev.messages, newMsg], status: "IN_PROGRESS" }
          : null
      );

      setNewMessage("");
      toast.success("Nachricht gesendet");
    } catch (error) {
      toast.error("Fehler beim Senden");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );

      if (selectedTicket?.id === ticketId) {
        setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      toast.success(`Status auf "${statusConfig[newStatus]?.label}" geändert`);
    } catch (error) {
      toast.error("Fehler beim Ändern des Status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl mb-2">Support & Streitfälle</h1>
            <p className="text-muted-foreground">
              {openTickets} offene, {inProgressTickets} in Bearbeitung
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Aktualisieren
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-serif">{openTickets}</p>
                  <p className="text-xs text-muted-foreground">Offen</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-serif">{inProgressTickets}</p>
                  <p className="text-xs text-muted-foreground">In Bearbeitung</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-serif">
                    {tickets.filter((t) => t.type === "DISPUTE").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Streitfälle</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-serif">
                    {tickets.filter((t) => t.status === "RESOLVED").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Gelöst</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Suche nach Ticket, Betreff oder Nutzer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="OPEN">Offen</SelectItem>
              <SelectItem value="IN_PROGRESS">In Bearbeitung</SelectItem>
              <SelectItem value="RESOLVED">Gelöst</SelectItem>
              <SelectItem value="CLOSED">Geschlossen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ticket List */}
        {filteredTickets.length === 0 ? (
          <Card className="bg-card/50 border-border/50">
            <CardContent className="py-16 text-center">
              <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium mb-2">Keine Tickets gefunden</h3>
              <p className="text-muted-foreground">
                Alle Support-Anfragen wurden bearbeitet
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket, index) => {
              const TypeIcon = typeConfig[ticket.type]?.icon || MessageSquare;
              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card
                    className="bg-card/50 border-border/50 cursor-pointer hover:border-border transition-colors"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            ticket.type === "DISPUTE"
                              ? "bg-red-500/10 text-red-500"
                              : ticket.type === "REFUND"
                              ? "bg-orange-500/10 text-orange-500"
                              : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          <TypeIcon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground">
                              {ticket.ticketNumber}
                            </span>
                            <Badge
                              variant="secondary"
                              className={`${statusConfig[ticket.status]?.color} bg-opacity-20`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${statusConfig[ticket.status]?.color} mr-1.5`}
                              />
                              {statusConfig[ticket.status]?.label}
                            </Badge>
                            <Badge variant="outline">
                              {typeConfig[ticket.type]?.label}
                            </Badge>
                          </div>
                          <p className="font-medium truncate">{ticket.subject}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              {ticket.user.name}
                            </span>
                            {ticket.order && (
                              <span className="flex items-center gap-1">
                                <Package className="w-3.5 h-3.5" />
                                {ticket.order.orderNumber}
                              </span>
                            )}
                            <span>{formatDate(ticket.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {ticket.messages.length > 0 && (
                            <Badge variant="secondary">
                              {ticket.messages.length} Nachrichten
                            </Badge>
                          )}
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Ticket Detail Dialog */}
        <Dialog
          open={!!selectedTicket}
          onOpenChange={() => setSelectedTicket(null)}
        >
          <DialogContent className="max-w-2xl max-h-[85vh]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  {selectedTicket?.ticketNumber}
                  <Badge
                    variant="secondary"
                    className={`${
                      statusConfig[selectedTicket?.status || ""]?.color
                    } bg-opacity-20`}
                  >
                    {statusConfig[selectedTicket?.status || ""]?.label}
                  </Badge>
                </DialogTitle>
                <Select
                  value={selectedTicket?.status}
                  onValueChange={(value) =>
                    selectedTicket && handleStatusChange(selectedTicket.id, value)
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Offen</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Bearbeitung</SelectItem>
                    <SelectItem value="RESOLVED">Gelöst</SelectItem>
                    <SelectItem value="CLOSED">Geschlossen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              {/* Ticket Info */}
              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">{selectedTicket?.subject}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedTicket?.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {selectedTicket?.user.name} ({selectedTicket?.user.email})
                  </span>
                  {selectedTicket?.order && (
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" />
                      {selectedTicket.order.orderNumber}: {selectedTicket.order.title}
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Messages */}
              <div>
                <h4 className="font-medium mb-3">Konversation</h4>
                <ScrollArea className="h-[250px] pr-4">
                  {selectedTicket?.messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Noch keine Nachrichten
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedTicket?.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.isAdmin ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.isAdmin
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.isAdmin
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {msg.isAdmin ? "Admin" : selectedTicket.user.name} •{" "}
                              {formatDate(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Reply */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Antwort schreiben..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={2}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isLoading}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

