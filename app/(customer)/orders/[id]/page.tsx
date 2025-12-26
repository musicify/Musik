"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Clock,
  Calendar,
  Euro,
  MessageSquare,
  Download,
  Play,
  Pause,
  Send,
  Paperclip,
  Check,
  AlertCircle,
  FileAudio,
  User,
  Music,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock order data
const order = {
  id: "ORD-2024-003",
  title: "Corporate Video Soundtrack",
  description:
    "Energetischer Soundtrack für Unternehmensvideo über Innovation und Technologie. Der Track sollte modern, dynamisch und inspirierend klingen. Länge: 2-3 Minuten mit Aufbau zum Höhepunkt.",
  status: "IN_PROGRESS",
  director: {
    id: "dir1",
    name: "Max Müller",
    avatar: "from-violet-500 to-purple-600",
    badge: "PREMIUM",
  },
  customer: {
    name: "Max Mustermann",
  },
  price: 450,
  createdAt: "2024-01-20",
  deadline: "2024-02-05",
  progress: 60,
  revisions: { used: 1, total: 3 },
  license: "Commercial",
  genre: "Electronic",
  mood: "Energetic, Inspiring",
  duration: "2-3 Minuten",
  deliverables: [
    { id: "1", name: "draft_v1.mp3", type: "audio", date: "2024-01-25", size: "4.2 MB" },
    { id: "2", name: "draft_v2.mp3", type: "audio", date: "2024-01-28", size: "4.5 MB", current: true },
  ],
};

// Mock messages
const messages = [
  {
    id: "1",
    sender: "director",
    name: "Max Müller",
    avatar: "from-violet-500 to-purple-600",
    content: "Hallo! Vielen Dank für den Auftrag. Ich habe mir deine Anforderungen angeschaut und habe ein paar Fragen zur gewünschten Stimmung. Soll der Track durchgehend energetisch sein oder gibt es ruhigere Passagen?",
    time: "20. Jan, 14:30",
  },
  {
    id: "2",
    sender: "customer",
    name: "Max Mustermann",
    content: "Hi Max! Der Track sollte mit einer ruhigeren Intro beginnen und dann zum Höhepunkt hin aufbauen. Die letzten 30 Sekunden können dann wieder etwas ruhiger ausklingen.",
    time: "20. Jan, 15:45",
  },
  {
    id: "3",
    sender: "director",
    name: "Max Müller",
    avatar: "from-violet-500 to-purple-600",
    content: "Perfekt, das macht Sinn! Ich werde mit einer atmosphärischen Einleitung beginnen und dann den Beat langsam aufbauen. Hier ist mein erster Entwurf:",
    time: "25. Jan, 10:15",
    attachment: {
      type: "audio",
      name: "draft_v1.mp3",
      duration: "2:45",
    },
  },
  {
    id: "4",
    sender: "customer",
    name: "Max Mustermann",
    content: "Super Anfang! Mir gefällt die Richtung sehr gut. Könntest du ab 1:20 noch etwas mehr Dynamik reinbringen? Der Drop könnte etwas kraftvoller sein.",
    time: "25. Jan, 16:20",
  },
  {
    id: "5",
    sender: "director",
    name: "Max Müller",
    avatar: "from-violet-500 to-purple-600",
    content: "Klar, das bekomme ich hin! Ich werde den Drop verstärken und noch ein paar Synth-Layer hinzufügen. Hier ist die überarbeitete Version:",
    time: "28. Jan, 11:00",
    attachment: {
      type: "audio",
      name: "draft_v2.mp3",
      duration: "2:48",
    },
  },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: "Wartet auf Angebot", color: "text-yellow-500", bgColor: "bg-yellow-500/20" },
  IN_PROGRESS: { label: "In Bearbeitung", color: "text-blue-500", bgColor: "bg-blue-500/20" },
  REVISION_REQUESTED: { label: "Revision angefragt", color: "text-orange-500", bgColor: "bg-orange-500/20" },
  READY_FOR_PAYMENT: { label: "Bereit zur Zahlung", color: "text-purple-500", bgColor: "bg-purple-500/20" },
  COMPLETED: { label: "Abgeschlossen", color: "text-green-500", bgColor: "bg-green-500/20" },
};

function MessageBubble({ message }: { message: (typeof messages)[0] }) {
  const isCustomer = message.sender === "customer";
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={`flex gap-3 ${isCustomer ? "flex-row-reverse" : ""}`}>
      {!isCustomer && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className={`bg-gradient-to-br ${message.avatar} text-white text-xs`}>
            {message.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[80%] ${isCustomer ? "text-right" : ""}`}>
        <p className="text-xs text-muted-foreground mb-1">
          {message.name} · {message.time}
        </p>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isCustomer
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-secondary rounded-bl-md"
          }`}
        >
          <p className="text-sm">{message.content}</p>
          {message.attachment && (
            <div
              className={`mt-3 p-3 rounded-lg flex items-center gap-3 ${
                isCustomer ? "bg-primary-foreground/10" : "bg-background/50"
              }`}
            >
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isCustomer ? "text-primary-foreground" : ""}`}>
                  {message.attachment.name}
                </p>
                <p className={`text-xs ${isCustomer ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {message.attachment.duration}
                </p>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const [newMessage, setNewMessage] = useState("");
  const status = statusConfig[order.status];

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          href="/orders"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Zurück zu Aufträgen
        </Link>

        <div className="grid lg:grid-cols-[1fr,350px] gap-8">
          {/* Main Content - Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-card/50 border-border/50 h-[calc(100vh-200px)] flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b border-border/50 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback
                        className={`bg-gradient-to-br ${order.director.avatar} text-white font-serif`}
                      >
                        {order.director.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{order.director.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Zuletzt aktiv vor 2 Stunden
                      </p>
                    </div>
                  </div>
                  <Badge className={`${status.bgColor} ${status.color} border-0`}>
                    {status.label}
                  </Badge>
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Nachricht schreiben..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-background"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newMessage.trim()) {
                        // Handle send
                        setNewMessage("");
                      }
                    }}
                  />
                  <Button disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Sidebar - Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Order Info */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-lg">
                  {order.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{order.id}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {order.description}
                </p>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preis</span>
                    <span className="font-medium text-primary">€{order.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lizenz</span>
                    <Badge variant="outline">{order.license}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Genre</span>
                    <span>{order.genre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stimmung</span>
                    <span>{order.mood}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Länge</span>
                    <span>{order.duration}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Erstellt
                    </span>
                    <span>
                      {new Date(order.createdAt).toLocaleDateString("de-DE")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Deadline
                    </span>
                    <span>
                      {new Date(order.deadline).toLocaleDateString("de-DE")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revisionen</span>
                    <span>
                      {order.revisions.used} / {order.revisions.total} verwendet
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Fortschritt</span>
                    <span>{order.progress}%</span>
                  </div>
                  <Progress value={order.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Deliverables */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Dateien</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.deliverables.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      file.current ? "bg-primary/10 border border-primary/30" : "bg-secondary/50"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <FileAudio className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.date} · {file.size}
                      </p>
                    </div>
                    {file.current && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        Aktuell
                      </Badge>
                    )}
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <AlertCircle className="w-4 h-4 mr-2" />
                Revision anfordern
              </Button>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Check className="w-4 h-4 mr-2" />
                Abnahme bestätigen
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
