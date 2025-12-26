"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Music,
  Package,
  Euro,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Check,
  X,
  Clock,
  AlertTriangle,
  Shield,
  Star,
  Eye,
  UserCheck,
  FileAudio,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock statistics
const stats = {
  totalUsers: 5234,
  newUsersThisMonth: 342,
  totalDirectors: 52,
  pendingVerifications: 4,
  totalTracks: 1847,
  pendingTracks: 12,
  totalRevenue: 125430,
  revenueThisMonth: 18750,
  activeOrders: 34,
  disputes: 2,
};

// Mock pending verifications
const pendingVerifications = [
  {
    id: "dir-new-1",
    name: "Julia Hoffmann",
    email: "julia@example.de",
    specialization: ["Pop", "R&B"],
    submittedAt: "2024-01-26",
    tracks: 5,
    avatarGradient: "from-pink-500 to-rose-600",
  },
  {
    id: "dir-new-2",
    name: "Thomas Berg",
    email: "thomas@example.de",
    specialization: ["Rock", "Indie"],
    submittedAt: "2024-01-25",
    tracks: 4,
    avatarGradient: "from-orange-500 to-red-600",
  },
  {
    id: "dir-new-3",
    name: "Maria Klein",
    email: "maria@example.de",
    specialization: ["Classical", "Film"],
    submittedAt: "2024-01-24",
    tracks: 6,
    avatarGradient: "from-violet-500 to-purple-600",
  },
];

// Mock pending tracks
const pendingTracks = [
  {
    id: "track-new-1",
    title: "Summer Breeze",
    director: "Max Müller",
    genre: "Electronic",
    submittedAt: "2024-01-27",
    coverGradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "track-new-2",
    title: "Midnight Tales",
    director: "Sarah Schmidt",
    genre: "Cinematic",
    submittedAt: "2024-01-27",
    coverGradient: "from-indigo-500 to-purple-600",
  },
  {
    id: "track-new-3",
    title: "Urban Jungle",
    director: "Tom Weber",
    genre: "Hip-Hop",
    submittedAt: "2024-01-26",
    coverGradient: "from-green-500 to-emerald-600",
  },
];

// Mock recent users
const recentUsers = [
  { id: "1", name: "Anna Schmidt", email: "anna@example.de", role: "CUSTOMER", joinedAt: "Heute" },
  { id: "2", name: "Peter Müller", email: "peter@example.de", role: "CUSTOMER", joinedAt: "Heute" },
  { id: "3", name: "Lisa Weber", email: "lisa@example.de", role: "CUSTOMER", joinedAt: "Gestern" },
  { id: "4", name: "Max Fischer", email: "max@example.de", role: "DIRECTOR", joinedAt: "Gestern" },
  { id: "5", name: "Julia Klein", email: "julia@example.de", role: "CUSTOMER", joinedAt: "25. Jan" },
];

// Mock disputes
const disputes = [
  {
    id: "dispute-1",
    orderId: "ORD-2024-015",
    customer: "Michael Braun",
    director: "Nina Hofmann",
    reason: "Qualität entspricht nicht der Beschreibung",
    createdAt: "2024-01-25",
    status: "OPEN",
  },
  {
    id: "dispute-2",
    orderId: "ORD-2024-012",
    customer: "Sandra Wolf",
    director: "Tom Weber",
    reason: "Deadline nicht eingehalten",
    createdAt: "2024-01-22",
    status: "IN_REVIEW",
  },
];

function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  trendPositive,
  color = "primary",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: string;
  trendPositive?: boolean;
  color?: string;
}) {
  const colorClasses = {
    primary: "bg-primary/20 text-primary",
    blue: "bg-blue-500/20 text-blue-500",
    green: "bg-green-500/20 text-green-500",
    yellow: "bg-yellow-500/20 text-yellow-500",
    red: "bg-red-500/20 text-red-500",
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <span className={`text-xs font-medium flex items-center gap-1 ${trendPositive ? "text-green-500" : "text-red-500"}`}>
              {trendPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend}
            </span>
          )}
        </div>
        <p className="text-2xl font-serif mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

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
            <h1 className="font-serif text-4xl mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Willkommen zurück, Administrator
            </p>
          </div>
          <div className="flex items-center gap-3">
            {stats.pendingVerifications > 0 && (
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">
                <Clock className="w-3 h-3 mr-1" />
                {stats.pendingVerifications} Verifizierungen ausstehend
              </Badge>
            )}
            {stats.disputes > 0 && (
              <Badge variant="secondary" className="bg-red-500/20 text-red-500">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {stats.disputes} offene Streitfälle
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            icon={Euro}
            label="Umsatz (Monat)"
            value={`€${stats.revenueThisMonth.toLocaleString()}`}
            trend="+23%"
            trendPositive
            color="primary"
          />
          <StatCard
            icon={Users}
            label="Nutzer"
            value={stats.totalUsers.toLocaleString()}
            subValue={`+${stats.newUsersThisMonth} diesen Monat`}
            trend="+18%"
            trendPositive
            color="blue"
          />
          <StatCard
            icon={Music}
            label="Tracks"
            value={stats.totalTracks.toLocaleString()}
            subValue={`${stats.pendingTracks} zur Freigabe`}
            color="green"
          />
          <StatCard
            icon={Package}
            label="Aktive Aufträge"
            value={stats.activeOrders}
            subValue={`${stats.disputes} Streitfälle`}
            color="yellow"
          />
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-card/50">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="verifications">
              Verifizierungen ({stats.pendingVerifications})
            </TabsTrigger>
            <TabsTrigger value="tracks">
              Track-Freigaben ({stats.pendingTracks})
            </TabsTrigger>
            <TabsTrigger value="disputes">
              Streitfälle ({stats.disputes})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-[1fr,400px] gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Pending Verifications Preview */}
                <Card className="bg-card/50 border-border/50">
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="font-serif">
                      Ausstehende Verifizierungen
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("verifications")}>
                      Alle ansehen
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pendingVerifications.slice(0, 3).map((dir) => (
                        <div
                          key={dir.id}
                          className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarFallback
                              className={`bg-gradient-to-br ${dir.avatarGradient} text-white`}
                            >
                              {dir.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{dir.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {dir.specialization.join(", ")}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              Prüfen
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Pending Tracks Preview */}
                <Card className="bg-card/50 border-border/50">
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="font-serif">
                      Tracks zur Freigabe
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("tracks")}>
                      Alle ansehen
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pendingTracks.map((track) => (
                        <div
                          key={track.id}
                          className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50"
                        >
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${track.coverGradient} flex-shrink-0`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{track.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {track.director} · {track.genre}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500">
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Recent Users */}
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif">Neue Nutzer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[250px]">
                      <div className="space-y-3">
                        {recentUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-3 p-2 rounded-lg"
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-secondary text-xs">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {user.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {user.email}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="text-xs">
                                {user.role === "DIRECTOR" ? "Komponist" : "Kunde"}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {user.joinedAt}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Platform Stats */}
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif">Plattform-Statistiken</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Gesamtumsatz</span>
                      <span className="font-medium">€{stats.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Registrierte Komponisten</span>
                      <span className="font-medium">{stats.totalDirectors}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tracks im Katalog</span>
                      <span className="font-medium">{stats.totalTracks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Abgeschlossene Aufträge</span>
                      <span className="font-medium">847</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Disputes Alert */}
                {disputes.length > 0 && (
                  <Card className="bg-red-500/10 border-red-500/20">
                    <CardHeader>
                      <CardTitle className="font-serif text-red-500 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Offene Streitfälle
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {disputes.map((dispute) => (
                          <div
                            key={dispute.id}
                            className="p-3 rounded-lg bg-background/50"
                          >
                            <p className="text-sm font-medium">{dispute.orderId}</p>
                            <p className="text-xs text-muted-foreground mb-2">
                              {dispute.reason}
                            </p>
                            <Button size="sm" variant="outline" className="w-full">
                              Details ansehen
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Verifications Tab */}
          <TabsContent value="verifications">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-serif">
                  Ausstehende Komponisten-Verifizierungen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Komponist</TableHead>
                      <TableHead>Spezialisierung</TableHead>
                      <TableHead>Tracks</TableHead>
                      <TableHead>Eingereicht</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingVerifications.map((dir) => (
                      <TableRow key={dir.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback
                                className={`bg-gradient-to-br ${dir.avatarGradient} text-white text-xs`}
                              >
                                {dir.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{dir.name}</p>
                              <p className="text-xs text-muted-foreground">{dir.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {dir.specialization.map((spec) => (
                              <Badge key={spec} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{dir.tracks} Samples</TableCell>
                        <TableCell>
                          {new Date(dir.submittedAt).toLocaleDateString("de-DE")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              Prüfen
                            </Button>
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                              <Check className="w-3 h-3 mr-1" />
                              Freigeben
                            </Button>
                            <Button size="sm" variant="destructive">
                              <X className="w-3 h-3 mr-1" />
                              Ablehnen
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracks Tab */}
          <TabsContent value="tracks">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-serif">Tracks zur Freigabe</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Track</TableHead>
                      <TableHead>Komponist</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead>Eingereicht</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingTracks.map((track) => (
                      <TableRow key={track.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${track.coverGradient}`}
                            />
                            <span className="font-medium">{track.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{track.director}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{track.genre}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(track.submittedAt).toLocaleDateString("de-DE")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              Anhören
                            </Button>
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                              <Check className="w-3 h-3 mr-1" />
                              Freigeben
                            </Button>
                            <Button size="sm" variant="destructive">
                              <X className="w-3 h-3 mr-1" />
                              Ablehnen
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-serif">Offene Streitfälle</CardTitle>
              </CardHeader>
              <CardContent>
                {disputes.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="w-12 h-12 mx-auto text-green-500 mb-4" />
                    <p className="font-medium">Keine offenen Streitfälle</p>
                    <p className="text-sm text-muted-foreground">
                      Alle Konflikte wurden gelöst.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Auftrag</TableHead>
                        <TableHead>Kunde</TableHead>
                        <TableHead>Komponist</TableHead>
                        <TableHead>Grund</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {disputes.map((dispute) => (
                        <TableRow key={dispute.id}>
                          <TableCell className="font-medium">{dispute.orderId}</TableCell>
                          <TableCell>{dispute.customer}</TableCell>
                          <TableCell>{dispute.director}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {dispute.reason}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                dispute.status === "OPEN"
                                  ? "bg-red-500/20 text-red-500"
                                  : "bg-yellow-500/20 text-yellow-500"
                              }
                            >
                              {dispute.status === "OPEN" ? "Offen" : "In Prüfung"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm">
                              <Eye className="w-3 h-3 mr-1" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
