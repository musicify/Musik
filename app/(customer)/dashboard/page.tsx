"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Download,
  FileText,
  Settings,
  Bell,
  Music,
  Clock,
  ArrowRight,
  Play,
  Pause,
  ChevronRight,
  Star,
  Award,
  Check,
  Calendar,
  Euro,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/use-notifications";
import { useUser } from "@clerk/nextjs";

// Mock user data (wird später durch echte Daten ersetzt)
const user = {
  name: "Max Mustermann",
  email: "max@example.de",
  avatar: null,
  memberSince: "Januar 2024",
  totalOrders: 12,
  totalDownloads: 28,
  activeOrders: 2,
};

// Mock orders
const recentOrders = [
  {
    id: "ORD-2024-003",
    title: "Corporate Video Soundtrack",
    status: "IN_PROGRESS",
    director: "Max Müller",
    price: 450,
    date: "2024-01-20",
    progress: 60,
  },
  {
    id: "ORD-2024-002",
    title: "Podcast Intro Music",
    status: "REVISION_REQUESTED",
    director: "Sarah Schmidt",
    price: 280,
    date: "2024-01-15",
    progress: 80,
  },
];

// Mock purchases
const recentPurchases = [
  {
    id: "PUR-001",
    title: "Neon Dreams",
    artist: "Max Müller",
    license: "Commercial",
    price: 49,
    date: "2024-01-22",
    coverGradient: "from-purple-500 to-pink-500",
  },
  {
    id: "PUR-002",
    title: "Epic Horizon",
    artist: "Sarah Schmidt",
    license: "Enterprise",
    price: 349,
    date: "2024-01-18",
    coverGradient: "from-amber-500 to-orange-600",
  },
  {
    id: "PUR-003",
    title: "Urban Flow",
    artist: "Tom Weber",
    license: "Commercial",
    price: 39,
    date: "2024-01-10",
    coverGradient: "from-cyan-500 to-blue-600",
  },
];

// Helper function to format time
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "gerade eben";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `vor ${minutes} ${minutes === 1 ? "Minute" : "Minuten"}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `vor ${hours} ${hours === 1 ? "Stunde" : "Stunden"}`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `vor ${days} ${days === 1 ? "Tag" : "Tagen"}`;
  } else {
    return date.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
  }
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Wartet auf Angebot", color: "bg-yellow-500" },
  OFFER_PENDING: { label: "Angebot erhalten", color: "bg-blue-500" },
  OFFER_ACCEPTED: { label: "In Auftrag", color: "bg-green-500" },
  IN_PROGRESS: { label: "In Bearbeitung", color: "bg-blue-500" },
  REVISION_REQUESTED: { label: "Revision", color: "bg-orange-500" },
  READY_FOR_PAYMENT: { label: "Bereit zur Zahlung", color: "bg-purple-500" },
  COMPLETED: { label: "Abgeschlossen", color: "bg-green-500" },
};

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
}) {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          {trend && (
            <span className="text-xs text-green-500 font-medium">{trend}</span>
          )}
        </div>
        <p className="text-2xl font-serif mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { notifications, unreadCount, loading: notificationsLoading, markAsRead } = useNotifications();
  const { user: clerkUser } = useUser();

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-serif">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl">
                Willkommen zurück, {user.name.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground">
                Mitglied seit {user.memberSince}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Benachrichtigungen
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={ShoppingBag}
            label="Gesamtbestellungen"
            value={user.totalOrders}
          />
          <StatCard
            icon={Download}
            label="Downloads"
            value={user.totalDownloads}
          />
          <StatCard
            icon={Package}
            label="Aktive Aufträge"
            value={user.activeOrders}
          />
          <StatCard
            icon={MessageSquare}
            label="Ungelesene Nachrichten"
            value="3"
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-6 bg-card/50">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="orders">Aufträge</TabsTrigger>
            <TabsTrigger value="purchases">Käufe</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-[1fr,350px] gap-6">
              {/* Active Orders */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="font-serif text-xl">
                    Aktive Aufträge
                  </CardTitle>
                  <Link href="/orders">
                    <Button variant="ghost" size="sm">
                      Alle ansehen
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/orders/${order.id}`}
                      className="block"
                    >
                      <div className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <p className="font-medium">{order.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.director} · {order.id}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`${
                              statusLabels[order.status]?.color
                            } bg-opacity-20`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                statusLabels[order.status]?.color
                              } mr-1.5`}
                            />
                            {statusLabels[order.status]?.label}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Fortschritt
                            </span>
                            <span>{order.progress}%</span>
                          </div>
                          <Progress value={order.progress} className="h-2" />
                        </div>
                      </div>
                    </Link>
                  ))}

                  {recentOrders.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground">
                        Keine aktiven Aufträge
                      </p>
                      <Link href="/custom-music">
                        <Button variant="outline" size="sm" className="mt-3">
                          Neuen Auftrag erstellen
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notifications & Activity */}
              <div className="space-y-6">
                {/* Notifications */}
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">
                      Benachrichtigungen
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-3">
                        {notificationsLoading ? (
                          <div className="text-center py-4 text-sm text-muted-foreground">
                            Lade Benachrichtigungen...
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="text-center py-4 text-sm text-muted-foreground">
                            Keine Benachrichtigungen
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((notification) => (
                            <Link
                              key={notification.id}
                              href={notification.link || "#"}
                              onClick={() => {
                                if (!notification.is_read) {
                                  markAsRead(notification.id);
                                }
                              }}
                              className={`flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors ${
                                !notification.is_read
                                  ? "bg-primary/5"
                                  : "bg-transparent"
                              }`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                  !notification.is_read
                                    ? "bg-primary"
                                    : "bg-muted-foreground/30"
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">{notification.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatTime(notification.created_at)}
                                </p>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">
                      Schnellzugriff
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/marketplace">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-auto py-3"
                      >
                        <Music className="w-4 h-4 mr-3" />
                        <div className="text-left">
                          <p className="font-medium">Musik entdecken</p>
                          <p className="text-xs text-muted-foreground">
                            Durchsuche den Katalog
                          </p>
                        </div>
                      </Button>
                    </Link>
                    <Link href="/custom-music">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-auto py-3"
                      >
                        <Package className="w-4 h-4 mr-3" />
                        <div className="text-left">
                          <p className="font-medium">Neuer Auftrag</p>
                          <p className="text-xs text-muted-foreground">
                            Custom Music beauftragen
                          </p>
                        </div>
                      </Button>
                    </Link>
                    <Link href="/downloads">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-auto py-3"
                      >
                        <Download className="w-4 h-4 mr-3" />
                        <div className="text-left">
                          <p className="font-medium">Downloads</p>
                          <p className="text-xs text-muted-foreground">
                            Gekaufte Musik herunterladen
                          </p>
                        </div>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Purchases */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="font-serif text-xl">
                  Letzte Käufe
                </CardTitle>
                <Link href="/purchases">
                  <Button variant="ghost" size="sm">
                    Alle ansehen
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentPurchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
                    >
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${purchase.coverGradient} flex-shrink-0`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{purchase.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {purchase.artist}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {purchase.license}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            €{purchase.price}
                          </span>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  Alle Aufträge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/orders/${order.id}`}
                      className="block"
                    >
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Music className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{order.title}</p>
                            <Badge
                              variant="secondary"
                              className={`${
                                statusLabels[order.status]?.color
                              } bg-opacity-20`}
                            >
                              {statusLabels[order.status]?.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.director} · {order.id}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary">
                            €{order.price}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.date}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Purchases Tab */}
          <TabsContent value="purchases">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  Gekaufte Musik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPurchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
                    >
                      <div
                        className={`w-14 h-14 rounded-lg bg-gradient-to-br ${purchase.coverGradient} flex-shrink-0`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{purchase.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {purchase.artist}
                        </p>
                      </div>
                      <div className="text-center">
                        <Badge variant="outline">{purchase.license}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {purchase.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€{purchase.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-1" />
                          Lizenz
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Downloads Tab */}
          <TabsContent value="downloads">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  Download-Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPurchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
                    >
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${purchase.coverGradient} flex-shrink-0`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{purchase.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {purchase.artist} · {purchase.license}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          WAV
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          MP3
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

