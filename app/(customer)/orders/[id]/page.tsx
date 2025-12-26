"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Clock,
  Calendar,
  Euro,
  Music,
  MessageSquare,
  FileText,
  Download,
  Check,
  X,
  AlertTriangle,
  Star,
  Award,
  Play,
  Pause,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { OrderChat } from "@/components/chat/order-chat";

// Mock order data
const mockOrder = {
  id: "ORD-2024-003",
  title: "Corporate Video Soundtrack",
  description:
    "Wir benötigen einen professionellen Soundtrack für unser neues Unternehmensvideo. Die Musik sollte modern, dynamisch und professionell klingen. Das Video dauert ca. 3 Minuten und zeigt unser Team und unsere Dienstleistungen.",
  status: "IN_PROGRESS",
  customer: {
    id: "cust1",
    name: "Max Mustermann",
    avatar: null,
  },
  director: {
    id: "dir1",
    name: "Max Müller",
    avatar: null,
    avatarGradient: "from-violet-500 to-purple-600",
    badge: "PREMIUM" as const,
    rating: 4.9,
  },
  genre: "Cinematic",
  mood: "Professional",
  useCase: "Corporate",
  duration: 180, // seconds
  budget: "€300 - €500",
  offeredPrice: 450,
  productionTime: 7, // days
  deadline: "2024-02-01",
  paymentModel: "PAY_ON_COMPLETION",
  includedRevisions: 2,
  usedRevisions: 1,
  progress: 60,
  createdAt: "2024-01-20",
  offerAcceptedAt: "2024-01-21",
};

// Mock messages
const mockMessages = [
  {
    id: "1",
    senderId: "cust1",
    senderName: "Max Mustermann",
    content: "Hallo! Ich freue mich auf die Zusammenarbeit.",
    createdAt: new Date("2024-01-20T10:00:00"),
    status: "read" as const,
  },
  {
    id: "2",
    senderId: "dir1",
    senderName: "Max Müller",
    content:
      "Vielen Dank für den Auftrag! Ich habe mir die Anforderungen angeschaut und würde gerne noch ein paar Fragen klären.",
    createdAt: new Date("2024-01-20T10:15:00"),
    status: "read" as const,
  },
  {
    id: "3",
    senderId: "dir1",
    senderName: "Max Müller",
    content:
      "Gibt es bestimmte Referenzsongs oder einen bestimmten Stil, den Sie sich vorstellen?",
    createdAt: new Date("2024-01-20T10:16:00"),
    status: "read" as const,
  },
  {
    id: "4",
    senderId: "cust1",
    senderName: "Max Mustermann",
    content:
      "Ja, wir mögen den Stil von Hans Zimmer - episch aber nicht zu überwältigend. Es sollte das Video unterstützen, nicht dominieren.",
    createdAt: new Date("2024-01-20T11:30:00"),
    status: "read" as const,
  },
  {
    id: "5",
    senderId: "system",
    senderName: "System",
    content: "Max Müller hat ein Angebot abgegeben",
    isSystemMessage: true,
    createdAt: new Date("2024-01-20T14:00:00"),
  },
  {
    id: "6",
    senderId: "system",
    senderName: "System",
    content: "Angebot wurde angenommen",
    isSystemMessage: true,
    createdAt: new Date("2024-01-21T09:00:00"),
  },
  {
    id: "7",
    senderId: "dir1",
    senderName: "Max Müller",
    content: "Perfekt! Ich starte jetzt mit der Produktion. Hier ist der erste Entwurf:",
    createdAt: new Date("2024-01-25T15:00:00"),
    status: "read" as const,
  },
  {
    id: "8",
    senderId: "dir1",
    senderName: "Max Müller",
    content: "",
    fileUrl: "/audio/draft_v1.mp3",
    fileType: "audio" as const,
    fileName: "corporate_soundtrack_v1.mp3",
    createdAt: new Date("2024-01-25T15:01:00"),
    status: "read" as const,
  },
  {
    id: "9",
    senderId: "cust1",
    senderName: "Max Mustermann",
    content:
      "Das klingt schon sehr gut! Könnten Sie ab 1:20 etwas mehr Dynamik reinbringen? Dort kommt der Höhepunkt des Videos.",
    createdAt: new Date("2024-01-25T16:30:00"),
    status: "delivered" as const,
  },
];

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  PENDING: { label: "Wartet auf Angebot", color: "bg-yellow-500", icon: Clock },
  OFFER_PENDING: {
    label: "Angebot erhalten",
    color: "bg-blue-500",
    icon: FileText,
  },
  OFFER_ACCEPTED: {
    label: "In Auftrag",
    color: "bg-green-500",
    icon: Check,
  },
  IN_PROGRESS: {
    label: "In Bearbeitung",
    color: "bg-blue-500",
    icon: Music,
  },
  REVISION_REQUESTED: {
    label: "Revision angefragt",
    color: "bg-orange-500",
    icon: RefreshCw,
  },
  READY_FOR_PAYMENT: {
    label: "Bereit zur Zahlung",
    color: "bg-purple-500",
    icon: CreditCard,
  },
  COMPLETED: {
    label: "Abgeschlossen",
    color: "bg-green-500",
    icon: Check,
  },
  CANCELLED: { label: "Storniert", color: "bg-red-500", icon: X },
  DISPUTED: {
    label: "Streitfall",
    color: "bg-red-500",
    icon: AlertTriangle,
  },
};

export default function OrderDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState(mockMessages);

  const statusInfo = statusConfig[mockOrder.status];

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: String(messages.length + 1),
      senderId: "cust1",
      senderName: "Max Mustermann",
      content,
      createdAt: new Date(),
      status: "delivered" as const,
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href="/dashboard"
            className="hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href="/orders"
            className="hover:text-foreground transition-colors"
          >
            Aufträge
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{mockOrder.id}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-serif text-2xl md:text-3xl">
                  {mockOrder.title}
                </h1>
                <Badge
                  className={`${statusInfo.color} bg-opacity-20 text-${statusInfo.color.replace(
                    "bg-",
                    ""
                  )}`}
                >
                  <statusInfo.icon className="w-3 h-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {mockOrder.id} · Erstellt am {mockOrder.createdAt}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {mockOrder.status === "READY_FOR_PAYMENT" && (
                <Button className="bg-primary hover:bg-primary/90">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Jetzt bezahlen
                </Button>
              )}
              {mockOrder.status === "IN_PROGRESS" && (
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Revision anfordern
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Fortschritt</span>
                <span className="text-sm text-muted-foreground">
                  {mockOrder.progress}%
                </span>
              </div>
              <Progress value={mockOrder.progress} className="h-2" />
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Auftrag erstellt</span>
                <span>Angebot</span>
                <span>In Arbeit</span>
                <span>Fertig</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr,350px] gap-6">
          {/* Left Column - Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="files" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Dateien
                </TabsTrigger>
              </TabsList>

              {/* Chat Tab */}
              <TabsContent value="chat" className="mt-4">
                <OrderChat
                  orderId={mockOrder.id}
                  currentUserId="cust1"
                  participants={[
                    {
                      id: mockOrder.customer.id,
                      name: mockOrder.customer.name,
                      isOnline: true,
                    },
                    {
                      id: mockOrder.director.id,
                      name: mockOrder.director.name,
                      isOnline: true,
                    },
                  ]}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  className="h-[600px]"
                />
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="mt-4">
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Beschreibung</h3>
                      <p className="text-muted-foreground">
                        {mockOrder.description}
                      </p>
                    </div>
                    <Separator />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm text-muted-foreground mb-1">
                          Genre
                        </h4>
                        <Badge variant="secondary">{mockOrder.genre}</Badge>
                      </div>
                      <div>
                        <h4 className="text-sm text-muted-foreground mb-1">
                          Stimmung
                        </h4>
                        <Badge variant="secondary">{mockOrder.mood}</Badge>
                      </div>
                      <div>
                        <h4 className="text-sm text-muted-foreground mb-1">
                          Verwendung
                        </h4>
                        <Badge variant="secondary">{mockOrder.useCase}</Badge>
                      </div>
                      <div>
                        <h4 className="text-sm text-muted-foreground mb-1">
                          Länge
                        </h4>
                        <p>
                          {Math.floor(mockOrder.duration / 60)}:
                          {(mockOrder.duration % 60).toString().padStart(2, "0")}{" "}
                          min
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Files Tab */}
              <TabsContent value="files" className="mt-4">
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Music className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            corporate_soundtrack_v1.mp3
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Entwurf v1 · 25.01.2024
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Right Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Director Card */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Komponist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-14 h-14">
                    <AvatarFallback
                      className={`bg-gradient-to-br ${mockOrder.director.avatarGradient} text-white text-xl`}
                    >
                      {mockOrder.director.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{mockOrder.director.name}</p>
                      <Badge className="badge-premium">
                        <Award className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {mockOrder.director.rating}
                    </div>
                  </div>
                </div>
                <Link href={`/directors/${mockOrder.director.id}`}>
                  <Button variant="outline" className="w-full">
                    Profil ansehen
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Auftragsdetails</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Preis</span>
                  <span className="font-semibold text-primary">
                    €{mockOrder.offeredPrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Produktionszeit</span>
                  <span>{mockOrder.productionTime} Tage</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deadline</span>
                  <span>{mockOrder.deadline}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revisionen</span>
                  <span>
                    {mockOrder.usedRevisions}/{mockOrder.includedRevisions}{" "}
                    verwendet
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zahlung</span>
                  <span>
                    {mockOrder.paymentModel === "PAY_ON_COMPLETION"
                      ? "Bei Fertigstellung"
                      : "Teilzahlung"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4 space-y-3">
                <Button variant="outline" className="w-full">
                  Problem melden
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                >
                  Auftrag stornieren
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

