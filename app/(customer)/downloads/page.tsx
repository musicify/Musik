"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Download,
  Play,
  Pause,
  Search,
  FileAudio,
  Calendar,
  Clock,
  Music,
  FileText,
  ChevronDown,
  Check,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock downloads data
const downloads = [
  {
    id: "dl-1",
    title: "Neon Dreams",
    artist: "Max Müller",
    purchaseDate: "2024-01-22",
    license: "Commercial",
    duration: 204,
    coverGradient: "from-purple-500 to-pink-500",
    formats: ["WAV", "MP3"],
    orderId: null,
    type: "marketplace",
  },
  {
    id: "dl-2",
    title: "Epic Horizon",
    artist: "Sarah Schmidt",
    purchaseDate: "2024-01-18",
    license: "Enterprise",
    duration: 252,
    coverGradient: "from-amber-500 to-orange-600",
    formats: ["WAV", "MP3", "STEMS"],
    orderId: null,
    type: "marketplace",
  },
  {
    id: "dl-3",
    title: "Corporate Video Soundtrack",
    artist: "Max Müller",
    purchaseDate: "2024-01-28",
    license: "Commercial",
    duration: 168,
    coverGradient: "from-blue-500 to-cyan-600",
    formats: ["WAV", "MP3"],
    orderId: "ORD-2024-003",
    type: "custom",
  },
  {
    id: "dl-4",
    title: "Urban Flow",
    artist: "Tom Weber",
    purchaseDate: "2024-01-10",
    license: "Commercial",
    duration: 178,
    coverGradient: "from-cyan-500 to-blue-600",
    formats: ["WAV", "MP3"],
    orderId: null,
    type: "marketplace",
  },
  {
    id: "dl-5",
    title: "YouTube Channel Intro",
    artist: "Tom Weber",
    purchaseDate: "2024-01-15",
    license: "Commercial",
    duration: 32,
    coverGradient: "from-rose-500 to-pink-600",
    formats: ["WAV", "MP3"],
    orderId: "ORD-2024-001",
    type: "custom",
  },
];

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function DownloadCard({ download }: { download: (typeof downloads)[0] }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Cover with Play Button */}
          <div
            className={`relative w-16 h-16 rounded-lg bg-gradient-to-br ${download.coverGradient} flex-shrink-0 group cursor-pointer`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-0.5" />
              )}
            </div>
            {isPlaying && (
              <div className="absolute bottom-1 left-1 flex items-end gap-0.5 h-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-white rounded-full animate-equalizer"
                    style={{ animationDelay: `${i * 0.15}s`, height: "100%" }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{download.title}</h3>
              {download.type === "custom" && (
                <Badge variant="secondary" className="text-xs">
                  Custom
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{download.artist}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(download.duration)}
              </span>
              <Badge variant="outline" className="text-xs h-5">
                {download.license}
              </Badge>
            </div>
          </div>

          {/* Purchase Date */}
          <div className="hidden sm:block text-right">
            <p className="text-xs text-muted-foreground">Gekauft am</p>
            <p className="text-sm">
              {new Date(download.purchaseDate).toLocaleDateString("de-DE")}
            </p>
          </div>

          {/* Download Actions */}
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/invoices?track=${download.id}`}>
                <FileText className="w-3.5 h-3.5 mr-1" />
                Lizenz
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Download
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {download.formats.map((format) => (
                  <DropdownMenuItem key={format}>
                    <FileAudio className="w-4 h-4 mr-2" />
                    {format} herunterladen
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DownloadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredDownloads = downloads.filter((download) => {
    const matchesSearch =
      download.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      download.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "all" || download.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const marketplaceCount = downloads.filter((d) => d.type === "marketplace").length;
  const customCount = downloads.filter((d) => d.type === "custom").length;

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-4xl mb-2">Downloads</h1>
          <p className="text-muted-foreground">
            {downloads.length} Tracks verfügbar · {marketplaceCount} Marktplatz,{" "}
            {customCount} Custom Music
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-3 gap-4 mb-8"
        >
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-serif">{downloads.length}</p>
                <p className="text-sm text-muted-foreground">Gekaufte Tracks</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-serif">{marketplaceCount}</p>
                <p className="text-sm text-muted-foreground">Marktplatz-Käufe</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <FileAudio className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-serif">{customCount}</p>
                <p className="text-sm text-muted-foreground">Custom Music</p>
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
              placeholder="Suche nach Titel oder Künstler..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Alle Typen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Typen</SelectItem>
              <SelectItem value="marketplace">Marktplatz</SelectItem>
              <SelectItem value="custom">Custom Music</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Downloads List */}
        <div className="space-y-4">
          {filteredDownloads.length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="py-16 text-center">
                <Download className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">Keine Downloads gefunden</h3>
                <p className="text-muted-foreground mb-4">
                  Kaufe Musik im Marktplatz oder beauftrage Custom Music.
                </p>
                <Link href="/marketplace">
                  <Button>Musik entdecken</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredDownloads.map((download, index) => (
              <motion.div
                key={download.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <DownloadCard download={download} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
