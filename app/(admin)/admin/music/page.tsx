"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Music,
  Play,
  Pause,
  Check,
  X,
  Clock,
  User,
  AlertTriangle,
  RefreshCw,
  Filter,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface PendingMusic {
  id: string;
  musicId: string;
  status: string;
  createdAt: string;
  music: {
    id: string;
    title: string;
    description: string;
    genre: string;
    mood?: string;
    duration: number;
    price: number;
    audioUrl: string;
    director?: {
      user: {
        name: string;
        image?: string;
      };
    };
  };
}

// Mock data for development
const mockPendingMusic: PendingMusic[] = [
  {
    id: "1",
    musicId: "m1",
    status: "PENDING",
    createdAt: "2024-01-20T10:00:00Z",
    music: {
      id: "m1",
      title: "Sunrise Melody",
      description: "Ein uplifting Track für motivierende Inhalte. Perfekt für Werbevideos und Social Media.",
      genre: "Pop",
      mood: "Uplifting",
      duration: 180,
      price: 49,
      audioUrl: "/audio/sample.mp3",
      director: {
        user: {
          name: "Sarah Schmidt",
          image: null,
        },
      },
    },
  },
  {
    id: "2",
    musicId: "m2",
    status: "PENDING",
    createdAt: "2024-01-19T14:30:00Z",
    music: {
      id: "m2",
      title: "Dark Atmosphere",
      description: "Düstere Ambient-Musik für Thriller und Horror-Projekte.",
      genre: "Ambient",
      mood: "Dark",
      duration: 240,
      price: 59,
      audioUrl: "/audio/sample2.mp3",
      director: {
        user: {
          name: "Max Müller",
          image: null,
        },
      },
    },
  },
  {
    id: "3",
    musicId: "m3",
    status: "PENDING",
    createdAt: "2024-01-18T09:15:00Z",
    music: {
      id: "m3",
      title: "Tech Innovation",
      description: "Futuristischer Electronic-Track für Tech-Präsentationen und Startup-Videos.",
      genre: "Electronic",
      mood: "Energetic",
      duration: 195,
      price: 69,
      audioUrl: "/audio/sample3.mp3",
      director: {
        user: {
          name: "Tom Weber",
          image: null,
        },
      },
    },
  },
];

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminMusicPage() {
  const [pendingMusic, setPendingMusic] = useState<PendingMusic[]>(mockPendingMusic);
  const [isLoading, setIsLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<PendingMusic | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredMusic = pendingMusic.filter((item) => {
    const matchesSearch =
      item.music.title.toLowerCase().includes(search.toLowerCase()) ||
      item.music.director?.user.name.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && item.music.genre.toLowerCase() === filter.toLowerCase();
  });

  const handleAction = async (approved: boolean) => {
    if (!selectedMusic) return;

    setIsLoading(true);
    try {
      // In production, this would call the API
      // await fetch(`/api/admin/music/${selectedMusic.musicId}/approve`, {
      //   method: "POST",
      //   body: JSON.stringify({ approved, reviewNote }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPendingMusic((prev) =>
        prev.filter((item) => item.id !== selectedMusic.id)
      );

      toast.success(
        approved
          ? `"${selectedMusic.music.title}" wurde freigegeben`
          : `"${selectedMusic.music.title}" wurde abgelehnt`
      );

      setSelectedMusic(null);
      setReviewNote("");
      setActionType(null);
    } catch (error) {
      toast.error("Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl mb-2">Musik-Freigaben</h1>
            <p className="text-muted-foreground">
              {pendingMusic.length} Tracks warten auf Freigabe
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Aktualisieren
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Suche nach Titel oder Künstler..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Genre Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Genres</SelectItem>
              <SelectItem value="electronic">Electronic</SelectItem>
              <SelectItem value="pop">Pop</SelectItem>
              <SelectItem value="ambient">Ambient</SelectItem>
              <SelectItem value="cinematic">Cinematic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Music List */}
        {filteredMusic.length === 0 ? (
          <Card className="bg-card/50 border-border/50">
            <CardContent className="py-16 text-center">
              <Music className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium mb-2">Keine ausstehenden Freigaben</h3>
              <p className="text-muted-foreground">
                Alle Tracks wurden bearbeitet
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMusic.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Track Preview */}
                      <div className="flex items-start gap-4 flex-1">
                        <button
                          className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/50 to-primary flex items-center justify-center flex-shrink-0"
                          onClick={() => setPlayingId(playingId === item.id ? null : item.id)}
                        >
                          {playingId === item.id ? (
                            <Pause className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 text-white ml-1" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg truncate">
                              {item.music.title}
                            </h3>
                            <Badge variant="secondary">{item.music.genre}</Badge>
                            {item.music.mood && (
                              <Badge variant="outline">{item.music.mood}</Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {item.music.description}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDuration(item.music.duration)}
                            </span>
                            <span>€{item.music.price}</span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              {item.music.director?.user.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-muted-foreground">
                          Eingereicht: {formatDate(item.createdAt)}
                        </p>
                        <Button
                          variant="outline"
                          className="text-red-500 hover:text-red-600 hover:border-red-500"
                          onClick={() => {
                            setSelectedMusic(item);
                            setActionType("reject");
                          }}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Ablehnen
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setSelectedMusic(item);
                            setActionType("approve");
                          }}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Freigeben
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Action Dialog */}
        <Dialog
          open={!!actionType}
          onOpenChange={() => {
            setActionType(null);
            setSelectedMusic(null);
            setReviewNote("");
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === "approve" ? "Track freigeben" : "Track ablehnen"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "approve"
                  ? `"${selectedMusic?.music.title}" wird im Marktplatz veröffentlicht.`
                  : `"${selectedMusic?.music.title}" wird abgelehnt und der Künstler wird benachrichtigt.`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  {actionType === "approve" ? "Hinweis (optional)" : "Ablehnungsgrund"}
                </label>
                <Textarea
                  placeholder={
                    actionType === "approve"
                      ? "Optionaler Hinweis für den Künstler..."
                      : "Bitte gib einen Grund für die Ablehnung an..."
                  }
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>

              {actionType === "reject" && !reviewNote && (
                <div className="flex items-center gap-2 text-amber-500 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Ein Ablehnungsgrund hilft dem Künstler bei der Verbesserung
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setActionType(null);
                  setSelectedMusic(null);
                  setReviewNote("");
                }}
              >
                Abbrechen
              </Button>
              <Button
                variant={actionType === "approve" ? "default" : "destructive"}
                onClick={() => handleAction(actionType === "approve")}
                disabled={isLoading || (actionType === "reject" && !reviewNote)}
              >
                {isLoading
                  ? "Wird bearbeitet..."
                  : actionType === "approve"
                  ? "Freigeben"
                  : "Ablehnen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

