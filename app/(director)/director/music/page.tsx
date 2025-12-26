"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Music,
  Upload,
  Search,
  Play,
  Pause,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Clock,
  Euro,
  BarChart3,
  Plus,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock tracks data
const tracks = [
  {
    id: "1",
    title: "Neon Dreams",
    genre: "Electronic",
    mood: "Energetic",
    duration: 204,
    price: 49,
    status: "APPROVED",
    plays: 12540,
    sales: 47,
    earnings: 2303,
    uploadDate: "2024-01-15",
    coverGradient: "from-purple-500 to-pink-500",
  },
  {
    id: "5",
    title: "Digital Pulse",
    genre: "Synthwave",
    mood: "Energetic",
    duration: 215,
    price: 55,
    status: "APPROVED",
    plays: 9800,
    sales: 32,
    earnings: 1760,
    uploadDate: "2024-01-10",
    coverGradient: "from-violet-500 to-indigo-600",
  },
  {
    id: "9",
    title: "Midnight Run",
    genre: "Cinematic",
    mood: "Dramatic",
    duration: 287,
    price: 79,
    status: "APPROVED",
    plays: 6720,
    sales: 18,
    earnings: 1422,
    uploadDate: "2024-01-05",
    coverGradient: "from-blue-500 to-cyan-600",
  },
  {
    id: "10",
    title: "Electric Horizons",
    genre: "Electronic",
    mood: "Uplifting",
    duration: 234,
    price: 59,
    status: "PENDING",
    plays: 0,
    sales: 0,
    earnings: 0,
    uploadDate: "2024-01-28",
    coverGradient: "from-amber-500 to-orange-600",
  },
  {
    id: "11",
    title: "Future Motion",
    genre: "Synthwave",
    mood: "Inspiring",
    duration: 198,
    price: 45,
    status: "APPROVED",
    plays: 4320,
    sales: 12,
    earnings: 540,
    uploadDate: "2023-12-20",
    coverGradient: "from-pink-500 to-rose-600",
  },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  APPROVED: { label: "Freigegeben", color: "text-green-500", bgColor: "bg-green-500/20" },
  PENDING: { label: "Ausstehend", color: "text-yellow-500", bgColor: "bg-yellow-500/20" },
  REJECTED: { label: "Abgelehnt", color: "text-red-500", bgColor: "bg-red-500/20" },
};

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function DirectorMusicPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const filteredTracks = tracks.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || track.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalEarnings = tracks.reduce((sum, t) => sum + t.earnings, 0);
  const totalPlays = tracks.reduce((sum, t) => sum + t.plays, 0);
  const totalSales = tracks.reduce((sum, t) => sum + t.sales, 0);

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
            <h1 className="font-serif text-4xl mb-2">Meine Musik</h1>
            <p className="text-muted-foreground">
              {tracks.length} Tracks im Katalog
            </p>
          </div>
          <Link href="/director/music/upload">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Upload className="w-4 h-4 mr-2" />
              Neuen Track hochladen
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Music className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-serif">{tracks.length}</p>
                  <p className="text-sm text-muted-foreground">Tracks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-serif">{totalPlays.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Aufrufe</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-serif">{totalSales}</p>
                  <p className="text-sm text-muted-foreground">Verkäufe</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Euro className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-serif">€{totalEarnings.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Einnahmen</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Suche nach Titel oder Genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="APPROVED">Freigegeben</SelectItem>
              <SelectItem value="PENDING">Ausstehend</SelectItem>
              <SelectItem value="REJECTED">Abgelehnt</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Tracks Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card/50 border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Track</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Preis</TableHead>
                  <TableHead className="text-right">Aufrufe</TableHead>
                  <TableHead className="text-right">Verkäufe</TableHead>
                  <TableHead className="text-right">Einnahmen</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTracks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16">
                      <Music className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="font-medium mb-1">Keine Tracks gefunden</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Lade deinen ersten Track hoch
                      </p>
                      <Link href="/director/music/upload">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Track hochladen
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTracks.map((track) => {
                    const status = statusConfig[track.status];
                    return (
                      <TableRow key={track.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={`relative w-12 h-12 rounded-lg bg-gradient-to-br ${track.coverGradient} flex-shrink-0 group cursor-pointer`}
                              onClick={() =>
                                setPlayingTrackId(
                                  playingTrackId === track.id ? null : track.id
                                )
                              }
                            >
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                {playingTrackId === track.id ? (
                                  <Pause className="w-5 h-5 text-white" />
                                ) : (
                                  <Play className="w-5 h-5 text-white ml-0.5" />
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">{track.title}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{track.genre}</span>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDuration(track.duration)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${status.bgColor} ${status.color} border-0`}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">€{track.price}</TableCell>
                        <TableCell className="text-right">
                          {track.plays.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">{track.sales}</TableCell>
                        <TableCell className="text-right font-medium text-primary">
                          €{track.earnings}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Ansehen
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pencil className="w-4 h-4 mr-2" />
                                Bearbeiten
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Löschen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
