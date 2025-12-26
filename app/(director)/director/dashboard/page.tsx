"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Music,
  Euro,
  TrendingUp,
  Clock,
  Star,
  Award,
  Check,
  Bell,
  Settings,
  Upload,
  Users,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  Eye,
  FileText,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Mock director data
const director = {
  name: "Max Müller",
  email: "max@musicify.de",
  avatar: null,
  badge: "PREMIUM" as const,
  rating: 4.9,
  reviewCount: 47,
  responseTime: 4, // hours
  completionRate: 98,
  totalProjects: 127,
  totalEarnings: 45680,
  monthlyEarnings: 3240,
  pendingEarnings: 890,
};

// Mock stats
const stats = {
  newOrders: 3,
  activeOrders: 5,
  completedThisMonth: 8,
  earningsChange: 12, // percentage
  views: 1245,
  viewsChange: 8,
};

// Mock orders
const pendingOrders = [
  {
    id: "ORD-2024-010",
    title: "Tech Startup Promo",
    customer: "Anna K.",
    budget: "€300 - €500",
    genre: "Electronic",
    deadline: "5 Tage",
    createdAt: "vor 2 Stunden",
  },
  {
    id: "ORD-2024-009",
    title: "Wedding Video Music",
    customer: "Michael S.",
    budget: "€400 - €600",
    genre: "Cinematic",
    deadline: "10 Tage",
    createdAt: "vor 5 Stunden",
  },
  {
    id: "ORD-2024-008",
    title: "Gaming Stream Intro",
    customer: "Lisa M.",
    budget: "€150 - €250",
    genre: "Electronic",
    deadline: "3 Tage",
    createdAt: "gestern",
  },
];

const activeOrders = [
  {
    id: "ORD-2024-007",
    title: "Corporate Video Soundtrack",
    customer: "TechStart GmbH",
    status: "IN_PROGRESS",
    price: 450,
    deadline: "2024-02-01",
    progress: 60,
  },
  {
    id: "ORD-2024-006",
    title: "Podcast Intro",
    customer: "Podcast Pro",
    status: "REVISION_REQUESTED",
    price: 280,
    deadline: "2024-01-28",
    progress: 80,
  },
];

// Mock portfolio tracks
const portfolioTracks = [
  {
    id: "1",
    title: "Neon Dreams",
    plays: 12540,
    purchases: 234,
    coverGradient: "from-purple-500 to-pink-500",
  },
  {
    id: "2",
    title: "Digital Pulse",
    plays: 9800,
    purchases: 189,
    coverGradient: "from-violet-500 to-indigo-600",
  },
  {
    id: "3",
    title: "Cyber Wave",
    plays: 7650,
    purchases: 156,
    coverGradient: "from-cyan-500 to-blue-600",
  },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Neu", color: "bg-yellow-500" },
  OFFER_PENDING: { label: "Angebot", color: "bg-blue-500" },
  IN_PROGRESS: { label: "In Arbeit", color: "bg-blue-500" },
  REVISION_REQUESTED: { label: "Revision", color: "bg-orange-500" },
  READY_FOR_PAYMENT: { label: "Zahlung", color: "bg-purple-500" },
  COMPLETED: { label: "Fertig", color: "bg-green-500" },
};

function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  changeLabel,
  positive,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  positive?: boolean;
}) {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          {change !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                positive ? "text-green-500" : "text-red-500"
              }`}
            >
              {positive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {change}%
            </div>
          )}
        </div>
        <p className="text-2xl font-serif mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {changeLabel && (
          <p className="text-xs text-muted-foreground mt-1">{changeLabel}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function DirectorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={director.avatar || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xl font-serif">
                {director.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-serif text-2xl sm:text-3xl">
                  {director.name}
                </h1>
                <Badge className="badge-premium">
                  <Award className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {director.rating} ({director.reviewCount})
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  ~{director.responseTime}h Antwort
                </span>
                <span>{director.completionRate}% Abschlussrate</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Benachrichtigungen
              <Badge className="ml-2 bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center">
                {stats.newOrders}
              </Badge>
            </Button>
            <Link href="/director/settings">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={Package}
            label="Neue Aufträge"
            value={stats.newOrders}
            changeLabel="Warten auf Angebot"
          />
          <MetricCard
            icon={TrendingUp}
            label="Einnahmen (Monat)"
            value={`€${director.monthlyEarnings.toLocaleString()}`}
            change={stats.earningsChange}
            positive={stats.earningsChange > 0}
          />
          <MetricCard
            icon={Eye}
            label="Profil-Aufrufe"
            value={stats.views.toLocaleString()}
            change={stats.viewsChange}
            positive={stats.viewsChange > 0}
          />
          <MetricCard
            icon={Euro}
            label="Ausstehend"
            value={`€${director.pendingEarnings}`}
            changeLabel="Warten auf Zahlung"
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-6 bg-card/50">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="orders">Aufträge</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="earnings">Einnahmen</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-[1fr,400px] gap-6">
              {/* Pending Orders */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="font-serif text-xl">
                    Neue Auftragsanfragen
                    <Badge className="ml-2 bg-primary">{pendingOrders.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-medium">{order.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.customer} · {order.createdAt}
                          </p>
                        </div>
                        <Badge variant="secondary">{order.genre}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span className="text-primary font-medium">
                            {order.budget}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {order.deadline}
                          </span>
                        </div>
                        <Link href={`/director/orders/${order.id}`}>
                          <Button size="sm">
                            Angebot abgeben
                            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Active Orders & Performance */}
              <div className="space-y-6">
                {/* Active Orders */}
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">
                      Aktive Projekte
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeOrders.map((order) => (
                      <Link
                        key={order.id}
                        href={`/director/orders/${order.id}`}
                        className="block"
                      >
                        <div className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-sm">{order.title}</p>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                statusLabels[order.status]?.color
                              } bg-opacity-20`}
                            >
                              {statusLabels[order.status]?.label}
                            </Badge>
                          </div>
                          <Progress value={order.progress} className="h-1.5 mb-2" />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{order.customer}</span>
                            <span>€{order.price}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Antwortzeit</span>
                        <span className="text-sm font-medium text-green-500">
                          {director.responseTime}h ✓
                        </span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Abschlussrate</span>
                        <span className="text-sm font-medium text-green-500">
                          {director.completionRate}% ✓
                        </span>
                      </div>
                      <Progress value={director.completionRate} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Kundenzufriedenheit</span>
                        <span className="text-sm font-medium">
                          {director.rating}/5.0
                        </span>
                      </div>
                      <Progress value={(director.rating / 5) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Top Portfolio Tracks */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="font-serif text-xl">
                  Top Tracks
                </CardTitle>
                <Link href="/director/portfolio">
                  <Button variant="ghost" size="sm">
                    Portfolio verwalten
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  {portfolioTracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
                    >
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${track.coverGradient} flex-shrink-0`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{track.title}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            {track.plays.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Euro className="w-3 h-3" />
                            {track.purchases}
                          </span>
                        </div>
                      </div>
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
                <p className="text-muted-foreground">
                  Auftragsübersicht wird hier angezeigt...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="font-serif text-xl">
                  Mein Portfolio
                </CardTitle>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Track hochladen
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolioTracks.map((track) => (
                    <Card key={track.id} className="bg-secondary/50 border-none">
                      <CardContent className="p-4">
                        <div
                          className={`aspect-square rounded-lg bg-gradient-to-br ${track.coverGradient} mb-4`}
                        />
                        <p className="font-medium mb-2">{track.title}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{track.plays.toLocaleString()} Plays</span>
                          <span>{track.purchases} Verkäufe</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Gesamteinnahmen
                  </p>
                  <p className="text-3xl font-serif text-primary">
                    €{director.totalEarnings.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Diesen Monat
                  </p>
                  <p className="text-3xl font-serif">
                    €{director.monthlyEarnings.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Ausstehend
                  </p>
                  <p className="text-3xl font-serif text-orange-500">
                    €{director.pendingEarnings}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

