"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Upload,
  Music,
  FileAudio,
  X,
  ChevronLeft,
  Check,
  Info,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

const genres = [
  "Electronic",
  "Cinematic",
  "Pop",
  "Hip-Hop",
  "Rock",
  "Classical",
  "Ambient",
  "Jazz",
  "Corporate",
  "World Music",
];

const moods = [
  "Energetic",
  "Uplifting",
  "Melancholic",
  "Dramatic",
  "Relaxed",
  "Dark",
  "Happy",
  "Epic",
  "Mysterious",
  "Romantic",
];

const useCases = [
  "Advertising",
  "YouTube",
  "Film / TV",
  "Podcast",
  "Gaming",
  "Corporate",
  "Social Media",
  "Events",
];

export default function UploadTrackPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
    }
  };

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const toggleUseCase = (useCase: string) => {
    setSelectedUseCases((prev) =>
      prev.includes(useCase)
        ? prev.filter((u) => u !== useCase)
        : [...prev, useCase]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setUploadProgress(i);
    }
    
    // Redirect after upload
    setTimeout(() => {
      window.location.href = "/director/music";
    }, 500);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          href="/director/music"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Zurück zur Musikübersicht
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-4xl mb-2">Track hochladen</h1>
          <p className="text-muted-foreground">
            Lade einen neuen Track in den Marktplatz hoch
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr,350px] gap-8">
            {/* Main Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Audio Upload */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Audio-Datei</CardTitle>
                  <CardDescription>
                    WAV oder MP3, max. 100MB
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {audioFile ? (
                    <div className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-secondary/50">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <FileAudio className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{audioFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setAudioFile(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/50 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <Upload className="w-10 h-10 text-muted-foreground mb-4" />
                      <p className="font-medium mb-1">Audio-Datei auswählen</p>
                      <p className="text-sm text-muted-foreground">
                        oder per Drag & Drop hierher ziehen
                      </p>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={handleAudioUpload}
                      />
                    </label>
                  )}
                </CardContent>
              </Card>

              {/* Track Details */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Track-Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titel *</Label>
                    <Input
                      id="title"
                      placeholder="z.B. Neon Dreams"
                      className="mt-1 bg-background"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Beschreibung *</Label>
                    <Textarea
                      id="description"
                      placeholder="Beschreibe deinen Track..."
                      className="mt-1 bg-background"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Genre *</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Genre auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {genres.map((genre) => (
                            <SelectItem key={genre} value={genre.toLowerCase()}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Subgenre</Label>
                      <Input
                        placeholder="z.B. Synthwave"
                        className="mt-1 bg-background"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label>Tempo (BPM)</Label>
                      <Input
                        type="number"
                        placeholder="128"
                        className="mt-1 bg-background"
                      />
                    </div>
                    <div>
                      <Label>Tonart</Label>
                      <Input
                        placeholder="A Minor"
                        className="mt-1 bg-background"
                      />
                    </div>
                    <div>
                      <Label>Basispreis (€) *</Label>
                      <Input
                        type="number"
                        placeholder="49"
                        className="mt-1 bg-background"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mood & Use Cases */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Stimmung & Verwendung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="mb-3 block">Stimmung</Label>
                    <div className="flex flex-wrap gap-2">
                      {moods.map((mood) => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => toggleMood(mood)}
                          className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                            selectedMoods.includes(mood)
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-3 block">Verwendungszwecke</Label>
                    <div className="flex flex-wrap gap-2">
                      {useCases.map((useCase) => (
                        <button
                          key={useCase}
                          type="button"
                          onClick={() => toggleUseCase(useCase)}
                          className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                            selectedUseCases.includes(useCase)
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {useCase}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Cover Upload */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Cover-Bild</CardTitle>
                  <CardDescription>
                    JPG oder PNG, 1:1 Format empfohlen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {coverFile ? (
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary">
                      <img
                        src={URL.createObjectURL(coverFile)}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => setCoverFile(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-border/50 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Cover hochladen
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverUpload}
                      />
                    </label>
                  )}
                </CardContent>
              </Card>

              {/* Publishing Options */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Veröffentlichung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox id="exclusive" />
                    <div>
                      <label htmlFor="exclusive" className="font-medium text-sm cursor-pointer">
                        Exklusiv-Lizenz anbieten
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Ermögliche den vollständigen Rechtekauf
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox id="stems" />
                    <div>
                      <label htmlFor="stems" className="font-medium text-sm cursor-pointer">
                        Stems verfügbar
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Biete separate Spuren für Enterprise-Lizenzen an
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info Box */}
              <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-500">
                    Hinweis zur Freigabe
                  </p>
                  <p className="text-muted-foreground">
                    Dein Track wird nach dem Upload von unserem Team geprüft.
                    Die Freigabe dauert in der Regel 24-48 Stunden.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              {isUploading ? (
                <div className="space-y-3">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">
                    Upload läuft... {uploadProgress}%
                  </p>
                </div>
              ) : (
                <Button
                  type="submit"
                  disabled={!audioFile}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Track hochladen
                </Button>
              )}
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
