"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Check,
  X,
  Clock,
  Star,
  Award,
  Music,
  ExternalLink,
  RefreshCw,
  Filter,
  Search,
  Eye,
  Shield,
  AlertTriangle,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface PendingDirector {
  id: string;
  directorId: string;
  status: string;
  createdAt: string;
  director: {
    id: string;
    bio?: string;
    specialization: string[];
    priceRangeMin?: number;
    priceRangeMax?: number;
    portfolioTracks: string[];
    experience?: string;
    equipment?: string;
    languages: string[];
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      createdAt: string;
    };
  };
}

// Mock data
const mockPendingDirectors: PendingDirector[] = [
  {
    id: "1",
    directorId: "d1",
    status: "PENDING",
    createdAt: "2024-01-21T10:00:00Z",
    director: {
      id: "d1",
      bio: "Professioneller Komponist mit 10 Jahren Erfahrung in der Filmmusik. Spezialisiert auf orchestrale Arrangements und elektronische Produktionen.",
      specialization: ["Cinematic", "Electronic", "Orchestral"],
      priceRangeMin: 200,
      priceRangeMax: 2000,
      portfolioTracks: [
        "https://soundcloud.com/example/track1",
        "https://soundcloud.com/example/track2",
        "https://soundcloud.com/example/track3",
      ],
      experience: "10+ Jahre professionelle Musikproduktion. Zusammenarbeit mit internationalen Werbeagenturen und Filmproduktionen.",
      equipment: "Logic Pro X, Ableton Live, Native Instruments Komplete, Spitfire Audio Libraries",
      languages: ["Deutsch", "Englisch"],
      user: {
        id: "u1",
        name: "Alexander Neumann",
        email: "alex@example.de",
        image: null,
        createdAt: "2024-01-20T08:00:00Z",
      },
    },
  },
  {
    id: "2",
    directorId: "d2",
    status: "PENDING",
    createdAt: "2024-01-20T15:30:00Z",
    director: {
      id: "d2",
      bio: "Beatmaker und Producer aus Berlin. Hip-Hop, Trap und R&B sind meine Leidenschaft.",
      specialization: ["Hip-Hop", "Trap", "R&B"],
      priceRangeMin: 100,
      priceRangeMax: 800,
      portfolioTracks: [
        "https://soundcloud.com/example/beat1",
        "https://soundcloud.com/example/beat2",
      ],
      experience: "5 Jahre Erfahrung. Beats für verschiedene Künstler auf Spotify produziert.",
      equipment: "FL Studio, Ableton Live, Maschine MK3",
      languages: ["Deutsch"],
      user: {
        id: "u2",
        name: "Kevin Beats",
        email: "kevin@beats.de",
        image: null,
        createdAt: "2024-01-19T12:00:00Z",
      },
    },
  },
];

const mockVerifiedDirectors = [
  {
    id: "v1",
    name: "Max Müller",
    email: "max@musicify.de",
    badges: ["VERIFIED", "PREMIUM"],
    totalProjects: 47,
    rating: 4.9,
    verifiedAt: "2023-06-15",
  },
  {
    id: "v2",
    name: "Sarah Schmidt",
    email: "sarah@musicify.de",
    badges: ["VERIFIED", "TOP_SELLER"],
    totalProjects: 82,
    rating: 4.8,
    verifiedAt: "2023-08-20",
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDirectorsPage() {
  const [pendingDirectors, setPendingDirectors] = useState<PendingDirector[]>(mockPendingDirectors);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState<PendingDirector | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [search, setSearch] = useState("");
  const [detailView, setDetailView] = useState<PendingDirector | null>(null);

  const filteredDirectors = pendingDirectors.filter((item) =>
    item.director.user.name.toLowerCase().includes(search.toLowerCase()) ||
    item.director.user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = async (approved: boolean) => {
    if (!selectedDirector) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPendingDirectors((prev) =>
        prev.filter((item) => item.id !== selectedDirector.id)
      );

      toast.success(
        approved
          ? `${selectedDirector.director.user.name} wurde verifiziert`
          : `${selectedDirector.director.user.name} wurde abgelehnt`
      );

      setSelectedDirector(null);
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
            <h1 className="font-serif text-3xl mb-2">Regisseur-Verwaltung</h1>
            <p className="text-muted-foreground">
              Verifiziere und verwalte Komponisten auf der Plattform
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Aktualisieren
          </Button>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="mb-6">
            <TabsTrigger value="pending">
              Ausstehend ({pendingDirectors.length})
            </TabsTrigger>
            <TabsTrigger value="verified">Verifiziert</TabsTrigger>
            <TabsTrigger value="all">Alle</TabsTrigger>
          </TabsList>

          {/* Pending Tab */}
          <TabsContent value="pending">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Name oder E-Mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 max-w-md"
              />
            </div>

            {filteredDirectors.length === 0 ? (
              <Card className="bg-card/50 border-border/50">
                <CardContent className="py-16 text-center">
                  <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Keine ausstehenden Verifizierungen
                  </h3>
                  <p className="text-muted-foreground">
                    Alle Anträge wurden bearbeitet
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredDirectors.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-card/50 border-border/50">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Director Info */}
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={item.director.user.image || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                {item.director.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">
                                  {item.director.user.name}
                                </h3>
                              </div>

                              <p className="text-sm text-muted-foreground mb-2">
                                {item.director.user.email}
                              </p>

                              <div className="flex flex-wrap gap-2 mb-3">
                                {item.director.specialization.map((spec) => (
                                  <Badge key={spec} variant="secondary">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>

                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.director.bio}
                              </p>

                              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                <span>
                                  Preisrahmen: €{item.director.priceRangeMin} - €
                                  {item.director.priceRangeMax}
                                </span>
                                <span>
                                  {item.director.portfolioTracks.length} Portfolio-Tracks
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col items-end gap-3">
                            <p className="text-xs text-muted-foreground">
                              Registriert: {formatDate(item.director.user.createdAt)}
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDetailView(item)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:border-red-500"
                                onClick={() => {
                                  setSelectedDirector(item);
                                  setActionType("reject");
                                }}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Ablehnen
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  setSelectedDirector(item);
                                  setActionType("approve");
                                }}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Verifizieren
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Verified Tab */}
          <TabsContent value="verified">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockVerifiedDirectors.map((director) => (
                <Card key={director.id} className="bg-card/50 border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {director.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{director.name}</p>
                          <Shield className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-sm text-muted-foreground">{director.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {director.badges.map((badge) => (
                        <Badge
                          key={badge}
                          className={
                            badge === "PREMIUM"
                              ? "badge-premium"
                              : badge === "TOP_SELLER"
                              ? "badge-top-seller"
                              : "badge-verified"
                          }
                        >
                          {badge === "PREMIUM" && <Award className="w-3 h-3 mr-1" />}
                          {badge === "TOP_SELLER" && <Star className="w-3 h-3 mr-1" />}
                          {badge === "VERIFIED" && <Check className="w-3 h-3 mr-1" />}
                          {badge.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{director.totalProjects} Projekte</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {director.rating}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* All Tab */}
          <TabsContent value="all">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Vollständige Liste aller Regisseure hier anzeigen...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detail View Dialog */}
        <Dialog open={!!detailView} onOpenChange={() => setDetailView(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {detailView?.director.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {detailView?.director.user.name}
              </DialogTitle>
              <DialogDescription>
                {detailView?.director.user.email}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 pr-4">
                <div>
                  <h4 className="font-medium mb-2">Über mich</h4>
                  <p className="text-sm text-muted-foreground">
                    {detailView?.director.bio || "Keine Beschreibung"}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Spezialisierungen</h4>
                  <div className="flex flex-wrap gap-2">
                    {detailView?.director.specialization.map((spec) => (
                      <Badge key={spec} variant="secondary">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Erfahrung</h4>
                  <p className="text-sm text-muted-foreground">
                    {detailView?.director.experience || "Keine Angabe"}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Equipment</h4>
                  <p className="text-sm text-muted-foreground">
                    {detailView?.director.equipment || "Keine Angabe"}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Portfolio-Tracks</h4>
                  <div className="space-y-2">
                    {detailView?.director.portfolioTracks.map((track, i) => (
                      <a
                        key={i}
                        href={track}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Music className="w-4 h-4" />
                        Track {i + 1}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Preisrahmen</h4>
                    <p className="text-sm text-muted-foreground">
                      €{detailView?.director.priceRangeMin} - €
                      {detailView?.director.priceRangeMax}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Sprachen</h4>
                    <p className="text-sm text-muted-foreground">
                      {detailView?.director.languages.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailView(null)}>
                Schließen
              </Button>
              <Button
                variant="outline"
                className="text-red-500 hover:text-red-600"
                onClick={() => {
                  setSelectedDirector(detailView);
                  setDetailView(null);
                  setActionType("reject");
                }}
              >
                Ablehnen
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setSelectedDirector(detailView);
                  setDetailView(null);
                  setActionType("approve");
                }}
              >
                Verifizieren
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Action Dialog */}
        <Dialog
          open={!!actionType}
          onOpenChange={() => {
            setActionType(null);
            setSelectedDirector(null);
            setReviewNote("");
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === "approve"
                  ? "Regisseur verifizieren"
                  : "Regisseur ablehnen"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "approve"
                  ? `${selectedDirector?.director.user.name} wird als verifizierter Komponist freigeschaltet.`
                  : `${selectedDirector?.director.user.name} wird abgelehnt und benachrichtigt.`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  {actionType === "approve"
                    ? "Willkommensnachricht (optional)"
                    : "Ablehnungsgrund"}
                </label>
                <Textarea
                  placeholder={
                    actionType === "approve"
                      ? "Optionale Nachricht für den neuen Regisseur..."
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
                  Ein Ablehnungsgrund ist erforderlich
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setActionType(null);
                  setSelectedDirector(null);
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
                  ? "Verifizieren"
                  : "Ablehnen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

