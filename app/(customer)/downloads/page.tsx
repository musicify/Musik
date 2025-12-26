"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Download,
  Search,
  Music,
  Play,
  Pause,
  FileAudio,
  FileText,
  Calendar,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

// Mock downloads
const mockDownloads = [
  {
    id: "1",
    title: "Neon Dreams",
    artist: "Electronic Producer",
    license: "COMMERCIAL",
    purchaseDate: "2024-01-05",
    expiresAt: null,
    type: "marketplace",
    downloadCount: 3,
    formats: ["MP3", "WAV"],
  },
  {
    id: "2",
    title: "Corporate Success",
    artist: "Max Müller",
    license: "PERSONAL",
    purchaseDate: "2024-01-03",
    expiresAt: null,
    type: "marketplace",
    downloadCount: 1,
    formats: ["MP3", "WAV"],
  },
  {
    id: "3",
    title: "Epic Cinematic Trailer",
    artist: "Sarah Schmidt",
    license: "COMMERCIAL",
    purchaseDate: "2024-01-01",
    expiresAt: null,
    type: "custom",
    downloadCount: 2,
    formats: ["MP3", "WAV", "STEMS"],
  },
  {
    id: "4",
    title: "Brand Jingle",
    artist: "Tom Weber",
    license: "EXCLUSIVE",
    purchaseDate: "2023-12-20",
    expiresAt: null,
    type: "custom",
    downloadCount: 5,
    formats: ["MP3", "WAV", "STEMS", "PROJECT"],
  },
];

export default function DownloadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Filter downloads
  const filteredDownloads = mockDownloads.filter((download) => {
    if (typeFilter !== "all" && download.type !== typeFilter) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !download.title.toLowerCase().includes(query) &&
        !download.artist.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl mb-2">Meine Downloads</h1>
          <p className="text-muted-foreground">
            Alle deine erworbenen Tracks an einem Ort
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-serif">{mockDownloads.length}</p>
                <p className="text-sm text-muted-foreground">Tracks erworben</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Download className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-serif">
                  {mockDownloads.reduce((sum, d) => sum + d.downloadCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Downloads gesamt</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-serif">
                  {mockDownloads.filter((d) => d.type === "custom").length}
                </p>
                <p className="text-sm text-muted-foreground">Custom Projekte</p>
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
                  placeholder="Downloads suchen..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="marketplace">Marktplatz</SelectItem>
                  <SelectItem value="custom">Custom Music</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Downloads Table */}
        <Card className="bg-card border-border/50">
          <CardContent className="p-0">
            {filteredDownloads.length === 0 ? (
              <div className="py-16 text-center">
                <Download className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">Keine Downloads gefunden</h3>
                <p className="text-muted-foreground mb-4">
                  {mockDownloads.length === 0
                    ? "Du hast noch keine Tracks erworben"
                    : "Versuche andere Filter"}
                </p>
                {mockDownloads.length === 0 && (
                  <Link href="/marketplace">
                    <Button>
                      <Music className="w-4 h-4 mr-2" />
                      Musik entdecken
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
                    <TableHead>Lizenz</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Kaufdatum</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDownloads.map((download, index) => {
                    const isPlaying = playingId === download.id;

                    return (
                      <motion.tr
                        key={download.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => setPlayingId(isPlaying ? null : download.id)}
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
                            <p className="font-medium">{download.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {download.artist}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              download.license === "EXCLUSIVE"
                                ? "license-exclusive"
                                : download.license === "COMMERCIAL"
                                ? "license-commercial"
                                : "license-personal"
                            }
                          >
                            {download.license}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {download.type === "custom" ? "Custom" : "Marktplatz"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(download.purchaseDate).toLocaleDateString("de-DE")}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {download.formats.map((format) => (
                              <Button
                                key={format}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <FileAudio className="w-3 h-3 mr-1" />
                                {format}
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-6">
              <h3 className="font-medium mb-2">
                Download-Hinweise
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Downloads sind unbegrenzt verfügbar</li>
                <li>• WAV-Dateien für professionelle Produktionen empfohlen</li>
                <li>• STEMS enthalten separate Spuren für weitere Bearbeitung</li>
                <li>
                  • Lizenzurkunden findest du unter{" "}
                  <Link href="/invoices" className="text-primary hover:underline">
                    Rechnungen
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

