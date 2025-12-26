"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Music,
  Package,
  Euro,
  Star,
  Clock,
  TrendingUp,
  Upload,
  ChevronRight,
  MessageSquare,
  Calendar,
  Award,
  BarChart3,
  Users,
  Eye,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock director data
const director = {
  name: "Max Müller",
  badge: "PREMIUM",
  avatarGradient: "from-violet-500 to-purple-600",
  rating: 4.9,
  reviews: 47,
  projects: 127,
  tracks: 47,
  monthlyEarnings: 3450,
  totalEarnings: 28750,
  responseTime: 1.8,
  completionRate: 98,
};

// Mock active orders
const activeOrders = [
  {
    id: "ORD-2024-003",
    title: "Corporate Video Soundtrack",
    customer: "Max Mustermann",
    status: "IN_PROGRESS",
    price: 450,
    deadline: "2024-02-05",
    progress: 60,
    messages: 3,
  },
  {
    id: "ORD-2024-004",
    title: "App Notification Sounds",
    customer: "Tech Startup GmbH",
    status: "PENDING",
    price: 150,
    deadline: null,
    progress: 0,
    messages: 2,
  },
  {
    id: "ORD-2024-005",
    title: "Podcast Intro Jingle",
    customer: "Lisa Media",
    status: "REVISION_REQUESTED",
    price: 280,
    deadline: "2024-02-10",
    progress: 85,
    messages: 7,
  },
];

// Mock recent sales
const recentSales = [
  { id: "1", title: "Neon Dreams", license: "Commercial", price: 49, date: "Heute" },
  { id: "2", title: "Digital Pulse", license: "Enterprise", price: 219, date: "Gestern" },
  { id: "3", title: "Midnight Run", license: "Commercial", price: 79, date: "22. Jan" },
  { id: "4", title: "Electric Horizons", license: "Personal", price: 35, date: "21. Jan" },
];

// Mock performance data
const performanceStats = [
  { label: "Track-Aufrufe", value: "12.4K", change: "+18%", positive: true },
  { label: "Conversion Rate", value: "3.2%", change: "+0.5%", positive: true },
  { label: "Durchschn. Bewertung", value: "4.9", change: "0", positive: true },
  { label: "Wiederkehrende Kunden", value: "68%", change: "+5%", positive: true },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: "Neuer Auftrag", color: "text-yellow-500", bgColor: "bg-yellow-500/20" },
  IN_PROGRESS: { label: "In Bearbeitung", color: "text-blue-500", bgColor: "bg-blue-500/20" },
  REVISION_REQUESTED: { label: "Revision", color: "text-orange-500", bgColor: "bg-orange-500/20" },
};

function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  trendPositive,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: string;
  trendPositive?: boolean;
}) {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          {trend && (
            <span
              className={`text-xs font-medium ${
                trendPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend}
            </span>
          )}
        </div>
        <p className="text-2xl font-serif mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {subValue && (
          <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function DirectorDashboard() {
  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback
                className={`bg-gradient-to-br ${director.avatarGradient} text-white text-xl font-serif`}
              >
                {director.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-serif text-2xl sm:text-3xl">
                  Hallo, {director.name.split(" ")[0]}!
                </h1>
                <Badge className="badge-premium">
                  <Award className="w-3 h-3 mr-1" />
                  {director.badge}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {director.rating} ({director.reviews} Bewertungen)
                </span>
                <span>{director.projects} Projekte</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/director/music/upload">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Upload className="w-4 h-4 mr-2" />
                Track hochladen
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            icon={Euro}
            label="Einnahmen (Monat)"
            value={`€${director.monthlyEarnings.toLocaleString()}`}
            trend="+12%"
            trendPositive
          />
          <StatCard
            icon={Music}
            label="Tracks im Katalog"
            value={director.tracks}
            subValue={`${recentSales.length} Verkäufe diese Woche`}
          />
          <StatCard
            icon={Package}
            label="Aktive Aufträge"
            value={activeOrders.length}
            subValue={`${activeOrders.filter((o) => o.status === "PENDING").length} neue Anfragen`}
          />
          <StatCard
            icon={Clock}
            label="Ø Antwortzeit"
            value={`${director.responseTime}h`}
            trend="Top 10%"
            trendPositive
          />
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Active Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="font-serif">Aktive Aufträge</CardTitle>
                  <Link href="/director/orders">
                    <Button variant="ghost" size="sm">
                      Alle ansehen
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeOrders.map((order) => {
                    const status = statusConfig[order.status];
                    return (
                      <Link key={order.id} href={`/director/orders/${order.id}`}>
                        <div className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <p className="font-medium">{order.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.customer} · {order.id}
                              </p>
                            </div>
                            <Badge className={`${status.bgColor} ${status.color} border-0`}>
                              {status.label}
                            </Badge>
                          </div>
                          {order.progress > 0 && (
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Fortschritt</span>
                                <span>{order.progress}%</span>
                              </div>
                              <Progress value={order.progress} className="h-2" />
                            </div>
                          )}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3 text-muted-foreground">
                              {order.deadline && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {new Date(order.deadline).toLocaleDateString("de-DE")}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5" />
                                {order.messages} ungelesen
                              </span>
                            </div>
                            <span className="font-medium text-primary">€{order.price}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {performanceStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="p-4 rounded-lg bg-secondary/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            {stat.label}
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              stat.positive ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {stat.change}
                          </span>
                        </div>
                        <p className="text-2xl font-serif">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Earnings Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Einnahmen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
                    <p className="text-4xl font-serif mb-1">
                      €{director.totalEarnings.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Gesamteinnahmen
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-secondary/50">
                      <p className="text-xl font-serif">€{director.monthlyEarnings}</p>
                      <p className="text-xs text-muted-foreground">Dieser Monat</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-secondary/50">
                      <p className="text-xl font-serif">{recentSales.length}</p>
                      <p className="text-xs text-muted-foreground">Verkäufe (Woche)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Sales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Letzte Verkäufe</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-3">
                      {recentSales.map((sale) => (
                        <div
                          key={sale.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                        >
                          <div>
                            <p className="font-medium text-sm">{sale.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {sale.license} · {sale.date}
                            </p>
                          </div>
                          <span className="font-medium text-primary">
                            €{sale.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Schnellzugriff</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/director/music">
                    <Button variant="ghost" className="w-full justify-start h-auto py-3">
                      <Music className="w-4 h-4 mr-3 text-primary" />
                      <div className="text-left">
                        <p className="font-medium text-sm">Meine Musik</p>
                        <p className="text-xs text-muted-foreground">
                          {director.tracks} Tracks verwalten
                        </p>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/director/orders">
                    <Button variant="ghost" className="w-full justify-start h-auto py-3">
                      <Package className="w-4 h-4 mr-3 text-primary" />
                      <div className="text-left">
                        <p className="font-medium text-sm">Aufträge</p>
                        <p className="text-xs text-muted-foreground">
                          {activeOrders.length} aktive Aufträge
                        </p>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/director/settings">
                    <Button variant="ghost" className="w-full justify-start h-auto py-3">
                      <Users className="w-4 h-4 mr-3 text-primary" />
                      <div className="text-left">
                        <p className="font-medium text-sm">Profil bearbeiten</p>
                        <p className="text-xs text-muted-foreground">
                          Portfolio und Einstellungen
                        </p>
                      </div>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
