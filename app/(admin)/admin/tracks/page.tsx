"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  Eye,
  Check,
  X,
  Flag,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Play,
  Music,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

// Mock tracks data
const mockTracks = [
  {
    id: "1",
    title: "Urban Dreams",
    director: "Max Müller",
    genre: "Electronic",
    status: "APPROVED",
    sales: 156,
    revenue: 4680,
    createdAt: "2024-01-10",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "2",
    title: "Sunset Memories",
    director: "Sarah Schmidt",
    genre: "Cinematic",
    status: "PENDING",
    sales: 0,
    revenue: 0,
    createdAt: "2024-01-27",
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: "3",
    title: "Night Runner",
    director: "Tom Weber",
    genre: "Hip-Hop",
    status: "APPROVED",
    sales: 89,
    revenue: 2670,
    createdAt: "2024-01-05",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    id: "4",
    title: "Morning Light",
    director: "Nina Hofmann",
    genre: "Ambient",
    status: "FLAGGED",
    sales: 45,
    revenue: 1350,
    createdAt: "2023-12-15",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "5",
    title: "Corporate Success",
    director: "Julia Klein",
    genre: "Corporate",
    status: "PENDING",
    sales: 0,
    revenue: 0,
    createdAt: "2024-01-26",
    gradient: "from-pink-500 to-rose-600",
  },
];

const stats = [
  { label: "Gesamt", value: 1847 },
  { label: "Aktiv", value: 1823 },
  { label: "Ausstehend", value: 12 },
  { label: "Gemeldet", value: 3 },
];

export default function AdminTracksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-4xl mb-2">Track-Verwaltung</h1>
          <p className="text-muted-foreground">
            Verwalte und moderiere Tracks auf der Plattform.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-serif">{stat.value.toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="bg-card/50 border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Suche nach Titel oder Komponist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="approved">Freigegeben</SelectItem>
                  <SelectItem value="pending">Ausstehend</SelectItem>
                  <SelectItem value="flagged">Gemeldet</SelectItem>
                </SelectContent>
              </Select>
              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Genres</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="cinematic">Cinematic</SelectItem>
                  <SelectItem value="hiphop">Hip-Hop</SelectItem>
                  <SelectItem value="ambient">Ambient</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tracks Table */}
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Track</TableHead>
                  <TableHead>Komponist</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verkäufe</TableHead>
                  <TableHead>Umsatz</TableHead>
                  <TableHead>Hinzugefügt</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTracks.map((track) => (
                  <TableRow key={track.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${track.gradient} flex items-center justify-center`}
                        >
                          <Music className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium">{track.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{track.director}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{track.genre}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          track.status === "APPROVED"
                            ? "bg-green-500/20 text-green-500"
                            : track.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-red-500/20 text-red-500"
                        }
                      >
                        {track.status === "APPROVED"
                          ? "Freigegeben"
                          : track.status === "PENDING"
                          ? "Ausstehend"
                          : "Gemeldet"}
                      </Badge>
                    </TableCell>
                    <TableCell>{track.sales}</TableCell>
                    <TableCell>€{track.revenue.toLocaleString()}</TableCell>
                    <TableCell>
                      {new Date(track.createdAt).toLocaleDateString("de-DE")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 mr-2" />
                            Anhören
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {track.status === "PENDING" && (
                            <>
                              <DropdownMenuItem className="text-green-500">
                                <Check className="w-4 h-4 mr-2" />
                                Freigeben
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">
                                <X className="w-4 h-4 mr-2" />
                                Ablehnen
                              </DropdownMenuItem>
                            </>
                          )}
                          {track.status === "FLAGGED" && (
                            <DropdownMenuItem>
                              <Flag className="w-4 h-4 mr-2" />
                              Meldung prüfen
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-500">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Entfernen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Zeige 1-5 von 1.847 Tracks
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="ghost" size="sm">2</Button>
            <Button variant="ghost" size="sm">3</Button>
            <span className="text-muted-foreground">...</span>
            <Button variant="ghost" size="sm">370</Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

