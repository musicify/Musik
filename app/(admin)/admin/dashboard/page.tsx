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
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Star,
  Eye,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  UserX,
  Ban,
  CheckSquare,
  XSquare,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock admin stats
const stats = {
  totalUsers: 5234,
  usersChange: 12,
  totalDirectors: 52,
  directorsChange: 8,
  totalTracks: 1245,
  tracksChange: 15,
  totalOrders: 892,
  ordersChange: 22,
  monthlyRevenue: 45680,
  revenueChange: 18,
  pendingVerifications: 5,
  pendingMusicApprovals: 12,
  openDisputes: 2,
};

// Mock pending verifications
const pendingVerifications = [
  {
    id: "dir5",
    name: "Chris Night",
    email: "chris@example.com",
    specialization: ["Ambient", "Experimental"],
    portfolioCount: 5,
    appliedAt: "vor 2 Stunden",
    avatarGradient: "from-gray-500 to-gray-700",
  },
  {
    id: "dir6",
    name: "Emma Sound",
    email: "emma@example.com",
    specialization: ["Pop", "R&B"],
    portfolioCount: 4,
    appliedAt: "vor 5 Stunden",
    avatarGradient: "from-pink-500 to-rose-500",
  },
  {
    id: "dir7",
    name: "David Keys",
    email: "david@example.com",
    specialization: ["Classical", "Orchestral"],
    portfolioCount: 7,
    appliedAt: "gestern",
    avatarGradient: "from-amber-500 to-yellow-500",
  },
];

// Mock pending music approvals
const pendingMusicApprovals = [
  {
    id: "mus1",
    title: "Dark Horizon",
    director: "Chris Night",
    genre: "Ambient",
    duration: 312,
    submittedAt: "vor 1 Stunde",
    coverGradient: "from-gray-600 to-gray-800",
  },
  {
    id: "mus2",
    title: "Summer Days",
    director: "Emma Sound",
    genre: "Pop",
    duration: 198,
    submittedAt: "vor 3 Stunden",
    coverGradient: "from-pink-400 to-orange-400",
  },
];

// Mock disputes
const openDisputes = [
  {
    id: "disp1",
    orderId: "ORD-2024-045",
    customer: "Michael T.",
    director: "Tom Weber",
    reason: "Qualität entspricht nicht der Beschreibung",
    amount: 350,
    openedAt: "vor 2 Tagen",
    status: "OPEN",
  },
  {
    id: "disp2",
    orderId: "ORD-2024-038",
    customer: "Sarah K.",
    director: "Lisa Braun",
    reason: "Lieferverzug",
    amount: 280,
    openedAt: "vor 5 Tagen",
    status: "IN_PROGRESS",
  },
];

// Mock recent transactions
const recentTransactions = [
  {
    id: "txn1",
    type: "purchase",
    user: "Anna K.",
    amount: 149,
    description: 'Track "Neon Dreams" - Enterprise',
    time: "vor 15 min",
  },
  {
    id: "txn2",
    type: "payout",
    user: "Max Müller",
    amount: -450,
    description: "Auftrag ORD-2024-052",
    time: "vor 1 Stunde",
  },
  {
    id: "txn3",
    type: "purchase",
    user: "TechStart GmbH",
    amount: 79,
    description: 'Track "Urban Flow" - Commercial',
    time: "vor 2 Stunden",
  },
];

function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  positive,
  alert,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: number;
  positive?: boolean;
  alert?: boolean;
  href?: string;
}) {
  const content = (
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            alert ? "bg-destructive/10" : "bg-primary/10"
          }`}
        >
          <Icon
            className={`w-5 h-5 ${alert ? "text-destructive" : "text-primary"}`}
          />
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
            {Math.abs(change)}%
          </div>
        )}
        {alert && (
          <Badge variant="destructive" className="text-xs">
            Aktion erforderlich
          </Badge>
        )}
      </div>
      <p className="text-2xl font-serif mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </CardContent>
  );

  if (href) {
    return (
      <Link href={href}>
        <Card className="bg-card/50 border-border/50 hover:border-border transition-colors cursor-pointer">
          {content}
        </Card>
      </Link>
    );
  }

  return <Card className="bg-card/50 border-border/50">{content}</Card>;
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl mb-1">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Übersicht und Verwaltung der Plattform
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={stats.openDisputes > 0 ? "destructive" : "secondary"}
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              {stats.openDisputes} offene Streitfälle
            </Badge>
            <Badge variant="secondary">
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          </div>
        </div>

        {/* Alerts */}
        {(stats.pendingVerifications > 0 ||
          stats.pendingMusicApprovals > 0 ||
          stats.openDisputes > 0) && (
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {stats.pendingVerifications > 0 && (
              <Card className="bg-amber-500/10 border-amber-500/30">
                <CardContent className="p-4 flex items-center gap-4">
                  <UserCheck className="w-8 h-8 text-amber-500" />
                  <div>
                    <p className="font-medium">
                      {stats.pendingVerifications} Verifizierungen
                    </p>
                    <p className="text-sm text-muted-foreground">
                      warten auf Prüfung
                    </p>
                  </div>
                  <Link href="/admin/directors" className="ml-auto">
                    <Button size="sm" variant="outline">
                      Prüfen
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
            {stats.pendingMusicApprovals > 0 && (
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-4 flex items-center gap-4">
                  <Music className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-medium">
                      {stats.pendingMusicApprovals} Tracks
                    </p>
                    <p className="text-sm text-muted-foreground">
                      warten auf Freigabe
                    </p>
                  </div>
                  <Link href="/admin/music" className="ml-auto">
                    <Button size="sm" variant="outline">
                      Prüfen
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
            {stats.openDisputes > 0 && (
              <Card className="bg-red-500/10 border-red-500/30">
                <CardContent className="p-4 flex items-center gap-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="font-medium">{stats.openDisputes} Streitfälle</p>
                    <p className="text-sm text-muted-foreground">
                      erfordern Mediation
                    </p>
                  </div>
                  <Link href="/admin/disputes" className="ml-auto">
                    <Button size="sm" variant="outline">
                      Bearbeiten
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Main Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <MetricCard
            icon={Users}
            label="Registrierte Nutzer"
            value={stats.totalUsers.toLocaleString()}
            change={stats.usersChange}
            positive={stats.usersChange > 0}
            href="/admin/users"
          />
          <MetricCard
            icon={Star}
            label="Verifizierte Komponisten"
            value={stats.totalDirectors}
            change={stats.directorsChange}
            positive={stats.directorsChange > 0}
            href="/admin/directors"
          />
          <MetricCard
            icon={Music}
            label="Tracks im Katalog"
            value={stats.totalTracks.toLocaleString()}
            change={stats.tracksChange}
            positive={stats.tracksChange > 0}
            href="/admin/music"
          />
          <MetricCard
            icon={Package}
            label="Custom Music Aufträge"
            value={stats.totalOrders}
            change={stats.ordersChange}
            positive={stats.ordersChange > 0}
            href="/admin/orders"
          />
          <MetricCard
            icon={Euro}
            label="Umsatz (Monat)"
            value={`€${stats.monthlyRevenue.toLocaleString()}`}
            change={stats.revenueChange}
            positive={stats.revenueChange > 0}
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-6 bg-card/50">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="verifications">
              Verifizierungen
              {stats.pendingVerifications > 0 && (
                <Badge className="ml-2 bg-amber-500">
                  {stats.pendingVerifications}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="music">
              Musik-Freigaben
              {stats.pendingMusicApprovals > 0 && (
                <Badge className="ml-2 bg-blue-500">
                  {stats.pendingMusicApprovals}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="disputes">
              Streitfälle
              {stats.openDisputes > 0 && (
                <Badge className="ml-2 bg-red-500">{stats.openDisputes}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">
                    Letzte Transaktionen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((txn) => (
                      <div
                        key={txn.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              txn.type === "purchase"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-orange-500/20 text-orange-500"
                            }`}
                          >
                            {txn.type === "purchase" ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{txn.user}</p>
                            <p className="text-xs text-muted-foreground">
                              {txn.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${
                              txn.amount > 0 ? "text-green-500" : "text-orange-500"
                            }`}
                          >
                            {txn.amount > 0 ? "+" : ""}€{Math.abs(txn.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {txn.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Platform Health */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">
                    Platform KPIs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Conversion Rate</span>
                      <span className="font-medium text-green-500">3.2%</span>
                    </div>
                    <Progress value={64} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Ziel: 5% | Aktuell über Durchschnitt
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Auftrags-Abschlussrate</span>
                      <span className="font-medium text-green-500">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Ziel: 85% | ✓ Erreicht
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Durchschn. Antwortzeit</span>
                      <span className="font-medium">6.5h</span>
                    </div>
                    <Progress value={70} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Ziel: &lt;8h | ✓ Erreicht
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Streitfallrate</span>
                      <span className="font-medium text-green-500">1.2%</span>
                    </div>
                    <Progress value={24} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Ziel: &lt;2% | ✓ Erreicht
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Verifications Tab */}
          <TabsContent value="verifications">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  Ausstehende Verifizierungen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingVerifications.map((director) => (
                    <div
                      key={director.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarFallback
                          className={`bg-gradient-to-br ${director.avatarGradient} text-white`}
                        >
                          {director.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{director.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {director.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {director.specialization.map((spec) => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                          <span className="text-xs text-muted-foreground">
                            · {director.portfolioCount} Portfolio-Tracks
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {director.appliedAt}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Prüfen
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckSquare className="w-4 h-4 mr-1" />
                          Bestätigen
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XSquare className="w-4 h-4 mr-1" />
                          Ablehnen
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Music Approvals Tab */}
          <TabsContent value="music">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  Ausstehende Musik-Freigaben
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingMusicApprovals.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
                    >
                      <div
                        className={`w-14 h-14 rounded-lg bg-gradient-to-br ${track.coverGradient} flex-shrink-0`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{track.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {track.director} · {track.genre} ·{" "}
                          {formatDuration(track.duration)}
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {track.submittedAt}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Anhören
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Freigeben
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Ban className="w-4 h-4 mr-1" />
                          Ablehnen
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  Offene Streitfälle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Auftrag</TableHead>
                      <TableHead>Kunde</TableHead>
                      <TableHead>Komponist</TableHead>
                      <TableHead>Grund</TableHead>
                      <TableHead>Betrag</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openDisputes.map((dispute) => (
                      <TableRow key={dispute.id}>
                        <TableCell className="font-medium">
                          {dispute.orderId}
                        </TableCell>
                        <TableCell>{dispute.customer}</TableCell>
                        <TableCell>{dispute.director}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {dispute.reason}
                        </TableCell>
                        <TableCell>€{dispute.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              dispute.status === "OPEN"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {dispute.status === "OPEN" ? "Offen" : "In Bearbeitung"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Mediieren
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

