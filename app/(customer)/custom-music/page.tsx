"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Music,
  Mic2,
  Clock,
  Euro,
  Star,
  Award,
  Info,
  Upload,
  FileText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

// Step data
const steps = [
  { id: 1, title: "Stil & Genre", icon: Music },
  { id: 2, title: "Details", icon: FileText },
  { id: 3, title: "Komponist", icon: Mic2 },
  { id: 4, title: "Übersicht", icon: Check },
];

// Options data
const genres = [
  { value: "electronic", label: "Electronic", icon: "🎹" },
  { value: "cinematic", label: "Cinematic", icon: "🎬" },
  { value: "pop", label: "Pop", icon: "🎤" },
  { value: "hiphop", label: "Hip-Hop", icon: "🎧" },
  { value: "rock", label: "Rock", icon: "🎸" },
  { value: "classical", label: "Classical", icon: "🎻" },
  { value: "ambient", label: "Ambient", icon: "🌊" },
  { value: "jazz", label: "Jazz", icon: "🎷" },
  { value: "corporate", label: "Corporate", icon: "🏢" },
  { value: "world", label: "World Music", icon: "🌍" },
];

const moods = [
  { value: "energetic", label: "Energetisch" },
  { value: "uplifting", label: "Erhebend" },
  { value: "melancholic", label: "Melancholisch" },
  { value: "dramatic", label: "Dramatisch" },
  { value: "relaxed", label: "Entspannt" },
  { value: "dark", label: "Düster" },
  { value: "happy", label: "Fröhlich" },
  { value: "epic", label: "Episch" },
  { value: "mysterious", label: "Mysteriös" },
  { value: "romantic", label: "Romantisch" },
];

const useCases = [
  { value: "advertising", label: "Werbung" },
  { value: "youtube", label: "YouTube" },
  { value: "film", label: "Film / TV" },
  { value: "podcast", label: "Podcast" },
  { value: "gaming", label: "Gaming" },
  { value: "corporate", label: "Corporate" },
  { value: "social", label: "Social Media" },
  { value: "events", label: "Events" },
];

const directors = [
  {
    id: "dir1",
    name: "Max Müller",
    specialization: ["Electronic", "Cinematic"],
    priceRange: "ab €200",
    badge: "PREMIUM",
    rating: 4.9,
    projects: 127,
    responseTime: "< 2h",
    avatarGradient: "from-violet-500 to-purple-600",
  },
  {
    id: "dir2",
    name: "Sarah Schmidt",
    specialization: ["Orchestral", "Film"],
    priceRange: "ab €350",
    badge: "TOP_SELLER",
    rating: 4.8,
    projects: 89,
    responseTime: "< 4h",
    avatarGradient: "from-amber-500 to-yellow-500",
  },
  {
    id: "dir3",
    name: "Tom Weber",
    specialization: ["Hip-Hop", "Pop"],
    priceRange: "ab €150",
    badge: "VERIFIED",
    rating: 4.7,
    projects: 64,
    responseTime: "< 6h",
    avatarGradient: "from-cyan-500 to-teal-500",
  },
  {
    id: "dir6",
    name: "Nina Hofmann",
    specialization: ["Corporate", "Advertising"],
    priceRange: "ab €250",
    badge: "PREMIUM",
    rating: 4.8,
    projects: 156,
    responseTime: "< 3h",
    avatarGradient: "from-emerald-500 to-teal-600",
  },
];

function BadgeIcon({ badge }: { badge: string | null }) {
  if (!badge) return null;
  const badgeConfig = {
    PREMIUM: { icon: Award, className: "badge-premium" },
    TOP_SELLER: { icon: Star, className: "badge-top-seller" },
    VERIFIED: { icon: Check, className: "badge-verified" },
  };
  const config = badgeConfig[badge as keyof typeof badgeConfig];
  if (!config) return null;
  return (
    <Badge className={config.className}>
      <config.icon className="w-3 h-3 mr-1" />
      {badge.replace("_", " ")}
              </Badge>
  );
}

export default function CustomMusicPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    genres: [] as string[],
    moods: [] as string[],
    useCases: [] as string[],
    title: "",
    description: "",
    references: "",
    duration: [120],
    budget: [500],
    deadline: "",
    selectedDirectors: [] as string[],
    license: "commercial",
  });

  const progress = useMemo(() => (currentStep / steps.length) * 100, [currentStep]);

  const updateFormData = useCallback((key: string, value: unknown) => {
    setFormData((prev) => {
      // Only update if value actually changed
      if (prev[key as keyof typeof prev] === value) {
        return prev;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const toggleArrayValue = useCallback((key: string, value: string) => {
    setFormData((prev) => {
      const arr = prev[key as keyof typeof prev] as string[];
      if (arr.includes(value)) {
        const newArr = arr.filter((v) => v !== value);
        // Only update if array actually changed
        if (newArr.length === arr.length) return prev;
        return { ...prev, [key]: newArr };
      } else {
        return { ...prev, [key]: [...arr, value] };
      }
    });
  }, []);

  // Memoized handlers for sliders to prevent excessive re-renders
  const handleDurationChange = useCallback((value: number[]) => {
    setFormData((prev) => {
      if (prev.duration[0] === value[0]) return prev;
      return { ...prev, duration: value };
    });
  }, []);

  const handleBudgetChange = useCallback((value: number[]) => {
    setFormData((prev) => {
      if (prev.budget[0] === value[0]) return prev;
      return { ...prev, budget: value };
    });
  }, []);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.genres.length > 0 && formData.moods.length > 0;
      case 2:
        return formData.title.length > 0 && formData.description.length > 10;
      case 3:
        return formData.selectedDirectors.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                Custom Music
              </Badge>
              <h1 className="font-serif text-4xl sm:text-5xl mb-4">
                Deine <span className="gradient-text">Vision</span>, unser Sound
              </h1>
              <p className="text-lg text-muted-foreground">
                Beschreibe dein Projekt und wähle aus unseren verifizierten
                Komponisten. Erhalte maßgeschneiderte Musik für dein Projekt.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < steps.length - 1 ? "flex-1" : ""
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    currentStep >= step.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-colors ${
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            {steps.map((step) => (
              <span
                key={step.id}
                className={
                  currentStep >= step.id
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }
              >
                {step.title}
              </span>
            ))}
          </div>
      </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Style & Genre */}
                {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                      <Label className="text-lg font-semibold mb-4 block">
                        Welches Genre suchen Sie?
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {genres.map((genre) => (
                          <button
                            key={genre.value}
                            onClick={() => toggleArrayValue("genres", genre.value)}
                            className={`p-4 rounded-lg border-2 text-center transition-all ${
                              formData.genres.includes(genre.value)
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-border/80"
                            }`}
                          >
                            <span className="text-2xl mb-2 block">
                              {genre.icon}
                            </span>
                            <span className="text-sm font-medium">
                              {genre.label}
                            </span>
                          </button>
                        ))}
                      </div>
                  </div>

                    <div>
                      <Label className="text-lg font-semibold mb-4 block">
                        Welche Stimmung soll die Musik haben?
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {moods.map((mood) => (
                          <button
                            key={mood.value}
                            onClick={() => toggleArrayValue("moods", mood.value)}
                            className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                              formData.moods.includes(mood.value)
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-border/80"
                            }`}
                          >
                            {mood.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  <div>
                      <Label className="text-lg font-semibold mb-4 block">
                        Wofür wird die Musik verwendet?
                      </Label>
                    <div className="flex flex-wrap gap-2">
                        {useCases.map((useCase) => (
                          <button
                            key={useCase.value}
                            onClick={() =>
                              toggleArrayValue("useCases", useCase.value)
                            }
                            className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                              formData.useCases.includes(useCase.value)
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-border/80"
                            }`}
                          >
                            {useCase.label}
                          </button>
                        ))}
                      </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Details */}
                {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                      <Label htmlFor="title" className="text-lg font-semibold mb-2 block">
                        Projekttitel
                      </Label>
                    <Input
                      id="title"
                      placeholder="z.B. Corporate Video Soundtrack"
                      value={formData.title}
                        onChange={(e) => updateFormData("title", e.target.value)}
                        className="bg-background"
                    />
                  </div>

                    <div>
                      <Label htmlFor="description" className="text-lg font-semibold mb-2 block">
                        Beschreibung
                    </Label>
                    <Textarea
                      id="description"
                        placeholder="Beschreiben Sie Ihr Projekt und Ihre Anforderungen so detailliert wie möglich..."
                      value={formData.description}
                      onChange={(e) =>
                          updateFormData("description", e.target.value)
                      }
                        rows={5}
                        className="bg-background resize-none"
                        style={{ resize: 'none' }}
                    />
                      <p className="text-xs text-muted-foreground mt-1">
                        Je detaillierter, desto besser können unsere Komponisten
                        Ihre Vision umsetzen.
                    </p>
                  </div>

                    <div>
                      <Label htmlFor="references" className="text-lg font-semibold mb-2 block">
                      Referenzen (optional)
                    </Label>
                    <Textarea
                      id="references"
                        placeholder="Links zu Musik, die Sie inspiriert hat, oder Beispiele für den gewünschten Stil..."
                      value={formData.references}
                      onChange={(e) =>
                          updateFormData("references", e.target.value)
                        }
                        rows={3}
                        className="bg-background resize-none"
                        style={{ resize: 'none' }}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-lg font-semibold mb-4 block">
                          Gewünschte Länge: {Math.floor(formData.duration[0] / 60)}:
                          {(formData.duration[0] % 60).toString().padStart(2, "0")} min
                        </Label>
                    <Slider
                          value={formData.duration}
                          onValueChange={handleDurationChange}
                      min={30}
                      max={600}
                      step={30}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>30 Sek</span>
                          <span>10 Min</span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-lg font-semibold mb-4 block">
                          Budget: €{formData.budget[0]}
                        </Label>
                        <Slider
                          value={formData.budget}
                          onValueChange={handleBudgetChange}
                          min={100}
                          max={5000}
                          step={50}
                          className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                          <span>€100</span>
                          <span>€5.000</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-lg font-semibold mb-4 block">
                        Lizenztyp
                      </Label>
                      <RadioGroup
                        value={formData.license}
                        onValueChange={(value) => updateFormData("license", value)}
                        className="grid sm:grid-cols-3 gap-4"
                      >
                        {[
                          { value: "personal", label: "Personal", price: "+0%" },
                          {
                            value: "commercial",
                            label: "Commercial",
                            price: "+50%",
                            popular: true,
                          },
                          {
                            value: "enterprise",
                            label: "Enterprise",
                            price: "+200%",
                          },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.license === option.value
                                ? "border-primary bg-primary/10"
                                : "border-border"
                            }`}
                          >
                            <RadioGroupItem
                              value={option.value}
                              className="sr-only"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{option.label}</p>
                              <p className="text-sm text-muted-foreground">
                                {option.price}
                              </p>
                            </div>
                            {option.popular && (
                              <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                                Beliebt
                              </Badge>
                            )}
                          </label>
                        ))}
                      </RadioGroup>
                  </div>
                </motion.div>
              )}

                {/* Step 3: Select Director */}
                {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                      <Label className="text-lg font-semibold mb-2 block">
                        Wählen Sie einen oder mehrere Komponisten
                      </Label>
                      <p className="text-sm text-muted-foreground mb-6">
                        Die ausgewählten Komponisten erhalten Ihre Anfrage und
                        können Ihnen ein Angebot unterbreiten.
                    </p>
                  </div>

                  <div className="space-y-4">
                      {directors.map((director) => (
                        <div
                        key={director.id}
                          onClick={() =>
                            toggleArrayValue("selectedDirectors", director.id)
                          }
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.selectedDirectors.includes(director.id)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-border/80"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Avatar className="w-14 h-14">
                                <AvatarFallback
                                  className={`bg-gradient-to-br ${director.avatarGradient} text-white text-lg font-serif`}
                                >
                                  {director.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {formData.selectedDirectors.includes(director.id) && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-primary-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">
                                  {director.name}
                                </span>
                                <BadgeIcon badge={director.badge} />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {director.specialization.join(" · ")}
                              </p>
                              <div className="flex items-center gap-4 mt-1 text-sm">
                                <span className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                  {director.rating}
                                </span>
                                <span className="text-muted-foreground">
                                  {director.projects} Projekte
                                </span>
                                <span className="text-muted-foreground">
                                  Antwort {director.responseTime}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-primary font-semibold">
                                {director.priceRange}
                              </span>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>

                  <Link href="/directors">
                      <Button variant="outline" className="w-full">
                      Alle Komponisten ansehen
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              )}

                {/* Step 4: Summary */}
                {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-8 h-8 text-primary" />
                      </div>
                    <h2 className="font-serif text-2xl mb-2">
                        Alles bereit für deinen Auftrag!
                    </h2>
                    <p className="text-muted-foreground">
                        Überprüfe deine Angaben und sende die Anfrage ab.
                    </p>
                  </div>

                    <Card className="bg-secondary/50 border-border/50">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Projekt</span>
                          <span className="font-medium">{formData.title}</span>
                  </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Genre</span>
                          <span className="font-medium">
                            {formData.genres
                              .map(
                                (g) => genres.find((genre) => genre.value === g)?.label
                              )
                              .join(", ")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stimmung</span>
                          <span className="font-medium">
                            {formData.moods
                              .map((m) => moods.find((mood) => mood.value === m)?.label)
                              .join(", ")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Länge</span>
                          <span className="font-medium">
                            {Math.floor(formData.duration[0] / 60)}:
                            {(formData.duration[0] % 60)
                              .toString()
                              .padStart(2, "0")}{" "}
                            min
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Budget</span>
                          <span className="font-medium">€{formData.budget[0]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lizenz</span>
                          <span className="font-medium capitalize">
                            {formData.license}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Komponisten</span>
                          <span className="font-medium">
                            {formData.selectedDirectors
                              .map((id) => directors.find((d) => d.id === id)?.name)
                              .join(", ")}
                          </span>
                        </div>
                    </CardContent>
                  </Card>

                    <div className="flex items-start gap-2 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-500">
                          So geht es weiter
                        </p>
                        <p className="text-muted-foreground">
                          Die ausgewählten Komponisten erhalten deine Anfrage per
                          E-Mail und können dir innerhalb von 24-48 Stunden ein
                          Angebot unterbreiten. Du kannst dann entscheiden, welches
                          Angebot du annimmst.
                        </p>
                      </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Zurück
                </Button>

                {currentStep < 4 ? (
                <Button
                    onClick={() => setCurrentStep((s) => s + 1)}
                    disabled={!canProceed()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Weiter
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg">
                    Anfrage absenden
                    <Check className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
