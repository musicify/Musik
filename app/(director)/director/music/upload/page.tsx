"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  Music,
  X,
  ChevronLeft,
  Image as ImageIcon,
  FileAudio,
  Check,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENRES, MOODS } from "@/lib/constants";
import Link from "next/link";

interface UploadedFile {
  file: File;
  preview?: string;
  progress: number;
  uploaded: boolean;
}

export default function UploadMusicPage() {
  const router = useRouter();
  const [audioFile, setAudioFile] = useState<UploadedFile | null>(null);
  const [coverImage, setCoverImage] = useState<UploadedFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    mood: "",
    tags: "",
    bpm: "",
    key: "",
    duration: "",
    pricePersonal: "29.99",
    priceCommercial: "79.99",
    priceEnterprise: "199.99",
    priceExclusive: "499.99",
    acceptTerms: false,
  });

  // Audio dropzone
  const onDropAudio = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setAudioFile({
        file,
        progress: 0,
        uploaded: false,
      });
      // Simulate upload progress
      simulateUpload(setAudioFile);
    }
  }, []);

  const { getRootProps: getAudioRootProps, getInputProps: getAudioInputProps, isDragActive: isAudioDragActive } = useDropzone({
    onDrop: onDropAudio,
    accept: {
      "audio/*": [".mp3", ".wav", ".flac", ".aac"],
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  // Cover image dropzone
  const onDropCover = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setCoverImage({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        uploaded: false,
      });
      simulateUpload(setCoverImage);
    }
  }, []);

  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps, isDragActive: isCoverDragActive } = useDropzone({
    onDrop: onDropCover,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // Simulate upload progress
  const simulateUpload = (setter: React.Dispatch<React.SetStateAction<UploadedFile | null>>) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setter((prev) => (prev ? { ...prev, progress: 100, uploaded: true } : null));
      } else {
        setter((prev) => (prev ? { ...prev, progress } : null));
      }
    }, 200);
  };

  const handleSubmit = async () => {
    if (!audioFile?.uploaded || !formData.acceptTerms) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.push("/director/music");
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/director/music"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Zurück zu Meine Musik
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl mb-2">Track hochladen</h1>
          <p className="text-muted-foreground">
            Lade deinen Track hoch und stelle ihn auf dem Marktplatz zur Verfügung
          </p>
        </div>

        <div className="space-y-6">
          {/* Audio Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileAudio className="w-5 h-5" />
                  Audio-Datei
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!audioFile ? (
                  <div
                    {...getAudioRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isAudioDragActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input {...getAudioInputProps()} />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      Audio-Datei hierher ziehen
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      oder klicken zum Auswählen
                    </p>
                    <p className="text-xs text-muted-foreground">
                      MP3, WAV, FLAC, AAC • Max. 100MB
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Music className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{audioFile.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(audioFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {!audioFile.uploaded && (
                        <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${audioFile.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                    {audioFile.uploaded ? (
                      <Badge className="bg-green-500/10 text-green-500">
                        <Check className="w-3 h-3 mr-1" />
                        Hochgeladen
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {Math.round(audioFile.progress)}%
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setAudioFile(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Cover-Bild
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Optional
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!coverImage ? (
                  <div
                    {...getCoverRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isCoverDragActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input {...getCoverInputProps()} />
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      Cover-Bild hierher ziehen
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      oder klicken zum Auswählen
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, WebP • 1:1 Format empfohlen • Max. 10MB
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    {coverImage.preview && (
                      <img
                        src={coverImage.preview}
                        alt="Cover preview"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{coverImage.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(coverImage.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    {coverImage.uploaded && (
                      <Badge className="bg-green-500/10 text-green-500">
                        <Check className="w-3 h-3 mr-1" />
                        Hochgeladen
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCoverImage(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Track Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Track-Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Titel *</Label>
                  <Input
                    id="title"
                    placeholder="z.B. Neon Dreams"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="description">Beschreibung *</Label>
                  <Textarea
                    id="description"
                    placeholder="Beschreibe deinen Track..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="genre">Genre *</Label>
                    <Select
                      value={formData.genre}
                      onValueChange={(value) =>
                        setFormData({ ...formData, genre: value })
                      }
                    >
                      <SelectTrigger id="genre">
                        <SelectValue placeholder="Genre wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENRES.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="mood">Stimmung *</Label>
                    <Select
                      value={formData.mood}
                      onValueChange={(value) =>
                        setFormData({ ...formData, mood: value })
                      }
                    >
                      <SelectTrigger id="mood">
                        <SelectValue placeholder="Stimmung wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOODS.map((mood) => (
                          <SelectItem key={mood} value={mood}>
                            {mood}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (durch Komma getrennt)</Label>
                  <Input
                    id="tags"
                    placeholder="z.B. synthwave, retro, 80s"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="bpm">BPM</Label>
                    <Input
                      id="bpm"
                      type="number"
                      placeholder="120"
                      value={formData.bpm}
                      onChange={(e) =>
                        setFormData({ ...formData, bpm: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="key">Tonart</Label>
                    <Input
                      id="key"
                      placeholder="C Major"
                      value={formData.key}
                      onChange={(e) =>
                        setFormData({ ...formData, key: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Dauer</Label>
                    <Input
                      id="duration"
                      placeholder="3:45"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Preise
                  <Info className="w-4 h-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="pricePersonal" className="flex items-center gap-2">
                      <Badge variant="secondary" className="license-personal">
                        Personal
                      </Badge>
                    </Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        €
                      </span>
                      <Input
                        id="pricePersonal"
                        type="number"
                        step="0.01"
                        className="pl-8"
                        value={formData.pricePersonal}
                        onChange={(e) =>
                          setFormData({ ...formData, pricePersonal: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="priceCommercial" className="flex items-center gap-2">
                      <Badge variant="secondary" className="license-commercial">
                        Commercial
                      </Badge>
                    </Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        €
                      </span>
                      <Input
                        id="priceCommercial"
                        type="number"
                        step="0.01"
                        className="pl-8"
                        value={formData.priceCommercial}
                        onChange={(e) =>
                          setFormData({ ...formData, priceCommercial: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="priceEnterprise" className="flex items-center gap-2">
                      <Badge variant="secondary" className="license-enterprise">
                        Enterprise
                      </Badge>
                    </Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        €
                      </span>
                      <Input
                        id="priceEnterprise"
                        type="number"
                        step="0.01"
                        className="pl-8"
                        value={formData.priceEnterprise}
                        onChange={(e) =>
                          setFormData({ ...formData, priceEnterprise: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="priceExclusive" className="flex items-center gap-2">
                      <Badge variant="secondary" className="license-exclusive">
                        Exclusive
                      </Badge>
                    </Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        €
                      </span>
                      <Input
                        id="priceExclusive"
                        type="number"
                        step="0.01"
                        className="pl-8"
                        value={formData.priceExclusive}
                        onChange={(e) =>
                          setFormData({ ...formData, priceExclusive: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-card border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-6">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, acceptTerms: checked as boolean })
                    }
                  />
                  <label htmlFor="terms" className="text-sm cursor-pointer">
                    Ich bestätige, dass ich alle notwendigen Rechte an diesem Track
                    besitze und die{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Nutzungsbedingungen
                    </Link>{" "}
                    akzeptiere.
                  </label>
                </div>

                <div className="flex items-center justify-end gap-4">
                  <Button variant="outline" asChild>
                    <Link href="/director/music">Abbrechen</Link>
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    disabled={
                      !audioFile?.uploaded ||
                      !formData.title ||
                      !formData.genre ||
                      !formData.mood ||
                      !formData.acceptTerms ||
                      isSubmitting
                    }
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Wird hochgeladen...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Track einreichen
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

