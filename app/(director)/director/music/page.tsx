"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Music,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Play,
  Pause,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock music tracks
const mockTracks = [
  {
    id: "1",
    title: "Neon Dreams",
    genre: "Electronic",
    mood: "Energetic",
    status: "APPROVED",
    price: 49.99,
    plays: 1247,
    sales: 23,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    title: "Midnight Pulse",
    genre: "Electronic",
    mood: "Dark",
    status: "APPROVED",
    price: 59.99,
    plays: 892,
    sales: 15,
    createdAt: "2024-01-03",
  },
  {
    id: "3",
    title: "Corporate Success",
    genre: "Corporate",
    mood: "Inspiring",
    status: "APPROVED",
    price: 39.99,
    plays: 2341,
    sales: 47,
    createdAt: "2023-12-15",
  },
  {
    id: "4",
    title: "Epic Journey",
    genre: "Cinematic",
    mood: "Epic",
    status: "PENDING_REVIEW",
    price: 79.99,
    plays: 0,
    sales: 0,
    createdAt: "2024-01-05",
  },
  {
    id: "5",
    title: "Chill Vibes",
    genre: "Lo-Fi",
    mood: "Relaxed",
    status: "REJECTED",
    price: 29.99,
    plays: 0,
    sales: 0,
    createdAt: "2024-01-02",
  },
];

const statusConfig = {
  APPROVED: {
    label: "Genehmigt",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    icon: CheckCircle2,
  },
  PENDING_REVIEW: {
    label: "In Prüfung",
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    icon: Clock,
  },
  REJECTED: {
    label: "Abgelehnt",
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: AlertCircle,
  },
};

export default function DirectorMusicPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Filter tracks
  const filteredTracks = mockTracks.filter((track) => {
    if (statusFilter !== "all" && track.status !== statusFilter) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !track.title.toLowerCase().includes(query) &&
        !track.genre.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    return true;
  });

  // Stats
  const totalTracks = mockTracks.length;
  const approvedTracks = mockTracks.filter((t) => t.status === "APPROVED").length;
  const pendingTracks = mockTracks.filter((t) => t.status === "PENDING_REVIEW").length;
  const totalPlays = mockTracks.reduce((sum, t) => sum + t.plays, 0);
  const totalSales = mockTracks.reduce((sum, t) => sum + t.sales, 0);
  const totalRevenue = mockTracks.reduce((sum, t) => sum + t.price * t.sales, 0);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl mb-2">Meine Musik</h1>
            <p className="text-muted-foreground">
              Verwalte deine Tracks auf dem Marktplatz
            </p>
          </div>
          <Link href="/director/music/upload">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Track hochladen
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tracks</p>
                  <p className="text-2xl font-serif">
                    {approvedTracks}/{totalTracks}
                  </p>
                </div>
                <Music className="w-8 h-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Plays</p>
                  <p className="text-2xl font-serif">{totalPlays.toLocaleString()}</p>
                </div>
                <Play className="w-8 h-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verkäufe</p>
                  <p className="text-2xl font-serif">{totalSales}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Einnahmen</p>
                  <p className="text-2xl font-serif">€{totalRevenue.toFixed(2)}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-1 w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tracks suchen..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="APPROVED">Genehmigt</SelectItem>
                  <SelectItem value="PENDING_REVIEW">In Prüfung</SelectItem>
                  <SelectItem value="REJECTED">Abgelehnt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tracks Table */}
        <Card className="bg-card border-border/50">
          <CardContent className="p-0">
            {filteredTracks.length === 0 ? (
              <div className="py-16 text-center">
                <Music className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">Keine Tracks gefunden</h3>
                <p className="text-muted-foreground mb-4">
                  {mockTracks.length === 0
                    ? "Du hast noch keine Tracks hochgeladen"
                    : "Versuche andere Filter"}
                </p>
                {mockTracks.length === 0 && (
                  <Link href="/director/music/upload">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Ersten Track hochladen
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Track</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Preis</TableHead>
                    <TableHead className="text-right">Plays</TableHead>
                    <TableHead className="text-right">Verkäufe</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTracks.map((track, index) => {
                    const status = statusConfig[track.status as keyof typeof statusConfig];
                    const StatusIcon = status.icon;
                    const isPlaying = playingId === track.id;

                    return (
                      <motion.tr
                        key={track.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group"
                      >
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => setPlayingId(isPlaying ? null : track.id)}
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{track.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {track.genre} • {track.mood}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={status.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          €{track.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {track.plays.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {track.sales}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Ansehen
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Bearbeiten
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Statistiken
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Löschen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

