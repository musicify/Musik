"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Music,
  Smile,
  Target,
  Users,
  FileText,
  Euro,
  Clock,
  Star,
  Award,
  ChevronRight,
  Loader2,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GENRES, MOODS, USE_CASES, ERAS } from "@/lib/constants";

// Mock directors data
const mockDirectors = [
  {
    id: "dir1",
    name: "Max Müller",
    specialization: ["Electronic", "Cinematic"],
    priceRange: "200 - 800",
    badge: "PREMIUM" as const,
    rating: 4.9,
    projects: 127,
    responseTime: 4,
    avatarGradient: "from-violet-500 to-purple-600",
  },
  {
    id: "dir2",
    name: "Sarah Schmidt",
    specialization: ["Orchestral", "Film"],
    priceRange: "350 - 1200",
    badge: "TOP_SELLER" as const,
    rating: 4.8,
    projects: 89,
    responseTime: 6,
    avatarGradient: "from-amber-500 to-yellow-500",
  },
  {
    id: "dir3",
    name: "Tom Weber",
    specialization: ["Hip-Hop", "Pop", "R&B"],
    priceRange: "150 - 500",
    badge: "VERIFIED" as const,
    rating: 4.7,
    projects: 64,
    responseTime: 8,
    avatarGradient: "from-cyan-500 to-teal-500",
  },
  {
    id: "dir4",
    name: "Lisa Braun",
    specialization: ["Ambient", "Electronic"],
    priceRange: "180 - 600",
    badge: "VERIFIED" as const,
    rating: 4.6,
    projects: 42,
    responseTime: 12,
    avatarGradient: "from-rose-500 to-pink-500",
  },
];

interface OrderFormData {
  // Step 1: Style & Genre
  genres: string[];
  moods: string[];
  useCases: string[];
  era: string;
  // Step 2: Details
  title: string;
  description: string;
  references: string;
  duration: number;
  // Step 3: Director Selection
  selectedDirectors: string[];
  // Step 4: Budget & Submit
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  paymentModel: "PAY_ON_COMPLETION" | "PARTIAL_PAYMENT";
  acceptTerms: boolean;
}

const initialFormData: OrderFormData = {
  genres: [],
  moods: [],
  useCases: [],
  era: "",
  title: "",
  description: "",
  references: "",
  duration: 180,
  selectedDirectors: [],
  budgetMin: 200,
  budgetMax: 500,
  deadline: "",
  paymentModel: "PAY_ON_COMPLETION",
  acceptTerms: false,
};

const steps = [
  { id: 1, name: "Stil & Genre", icon: Music },
  { id: 2, name: "Details", icon: FileText },
  { id: 3, name: "Komponist", icon: Users },
  { id: 4, name: "Budget & Absenden", icon: Euro },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
              currentStep >= step.id
                ? "bg-primary border-primary text-primary-foreground"
                : "border-muted-foreground/30 text-muted-foreground"
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
              className={`w-12 h-0.5 mx-2 transition-colors ${
                currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
  maxSelection,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelection?: number;
}) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else if (!maxSelection || selected.length < maxSelection) {
      onChange([...selected, option]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Label className="text-base">{label}</Label>
        {maxSelection && (
          <span className="text-xs text-muted-foreground">
            {selected.length}/{maxSelection} gewählt
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Badge
            key={option}
            variant={selected.includes(option) ? "default" : "outline"}
            className={`cursor-pointer transition-all py-1.5 px-3 ${
              selected.includes(option)
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
            onClick={() => toggleOption(option)}
          >
            {option}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function DirectorCard({
  director,
  isSelected,
  onToggle,
}: {
  director: (typeof mockDirectors)[0];
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected
          ? "border-primary shadow-glow-sm"
          : "border-border/50 hover:border-border"
      }`}
      onClick={onToggle}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${director.avatarGradient} flex items-center justify-center text-white text-xl font-serif flex-shrink-0`}
          >
            {director.name.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{director.name}</h3>
              <Badge
                className={
                  director.badge === "PREMIUM"
                    ? "badge-premium"
                    : director.badge === "TOP_SELLER"
                    ? "badge-top-seller"
                    : "badge-verified"
                }
              >
                {director.badge === "PREMIUM" && (
                  <Award className="w-3 h-3 mr-1" />
                )}
                {director.badge === "TOP_SELLER" && (
                  <Star className="w-3 h-3 mr-1" />
                )}
                {director.badge === "VERIFIED" && (
                  <Check className="w-3 h-3 mr-1" />
                )}
                {director.badge.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {director.specialization.join(" · ")}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {director.rating}
              </span>
              <span className="text-muted-foreground">
                {director.projects} Projekte
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                ~{director.responseTime}h
              </span>
            </div>
          </div>

          {/* Price & Selection */}
          <div className="text-right">
            <p className="text-primary font-medium">€{director.priceRange}</p>
            <div
              className={`mt-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                isSelected
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/50"
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CustomMusicPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = (step / steps.length) * 100;

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.genres.length > 0 && formData.moods.length > 0;
      case 2:
        return formData.title.length >= 5 && formData.description.length >= 20;
      case 3:
        return formData.selectedDirectors.length > 0;
      case 4:
        return formData.acceptTerms;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Redirect to order confirmation
    router.push("/orders/confirmation");
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <section className="relative py-8 lg:py-12 overflow-hidden">
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
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-4">
                Musik auf <span className="gradient-text">Bestellung</span>
              </h1>
              <p className="text-muted-foreground">
                Beschreibe dein Projekt und erhalte maßgeschneiderte Musik von
                professionellen Komponisten.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicator */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <StepIndicator currentStep={step} />
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="max-w-4xl mx-auto bg-card/50 border-border/50">
          <CardContent className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Style & Genre */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="font-serif text-2xl mb-2">Stil & Genre</h2>
                    <p className="text-muted-foreground">
                      Welche Art von Musik suchst du?
                    </p>
                  </div>

                  <MultiSelect
                    label="Genre (wähle bis zu 3)"
                    options={GENRES}
                    selected={formData.genres}
                    onChange={(genres) =>
                      setFormData({ ...formData, genres })
                    }
                    maxSelection={3}
                  />

                  <MultiSelect
                    label="Stimmung (wähle bis zu 3)"
                    options={MOODS}
                    selected={formData.moods}
                    onChange={(moods) => setFormData({ ...formData, moods })}
                    maxSelection={3}
                  />

                  <MultiSelect
                    label="Verwendungszweck"
                    options={USE_CASES}
                    selected={formData.useCases}
                    onChange={(useCases) =>
                      setFormData({ ...formData, useCases })
                    }
                    maxSelection={2}
                  />

                  <div>
                    <Label className="text-base mb-3 block">Epoche / Stil</Label>
                    <div className="flex flex-wrap gap-2">
                      {ERAS.map((era) => (
                        <Badge
                          key={era}
                          variant={formData.era === era ? "default" : "outline"}
                          className={`cursor-pointer transition-all py-1.5 px-3 ${
                            formData.era === era
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-secondary"
                          }`}
                          onClick={() => setFormData({ ...formData, era })}
                        >
                          {era}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-serif text-2xl mb-2">Projektdetails</h2>
                    <p className="text-muted-foreground">
                      Beschreibe dein Projekt so detailliert wie möglich.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Projekttitel *</Label>
                    <Input
                      id="title"
                      placeholder="z.B. Corporate Video Soundtrack"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Detaillierte Beschreibung *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Beschreibe, welche Musik du dir vorstellst. Was ist der Kontext? Welche Emotionen soll die Musik vermitteln? Gibt es bestimmte Instrumente oder Sounds, die du dir wünschst?"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="min-h-[150px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.description.length}/500 Zeichen (min. 20)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="references">
                      Referenzen (optional)
                    </Label>
                    <Textarea
                      id="references"
                      placeholder="Gibt es Songs oder Künstler, die als Inspiration dienen können? Füge Links zu Beispielen hinzu."
                      value={formData.references}
                      onChange={(e) =>
                        setFormData({ ...formData, references: e.target.value })
                      }
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Gewünschte Länge</Label>
                      <span className="text-sm text-muted-foreground">
                        {Math.floor(formData.duration / 60)}:
                        {(formData.duration % 60).toString().padStart(2, "0")}{" "}
                        min
                      </span>
                    </div>
                    <Slider
                      value={[formData.duration]}
                      min={30}
                      max={600}
                      step={30}
                      onValueChange={([duration]) =>
                        setFormData({ ...formData, duration })
                      }
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0:30</span>
                      <span>10:00</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Director Selection */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-serif text-2xl mb-2">
                      Komponisten wählen
                    </h2>
                    <p className="text-muted-foreground">
                      Wähle einen oder mehrere Komponisten, die deinen Auftrag
                      erhalten sollen.
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formData.selectedDirectors.length} Komponist(en)
                        ausgewählt
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Je mehr Komponisten, desto mehr Angebote
                    </span>
                  </div>

                  <div className="space-y-4">
                    {mockDirectors.map((director) => (
                      <DirectorCard
                        key={director.id}
                        director={director}
                        isSelected={formData.selectedDirectors.includes(
                          director.id
                        )}
                        onToggle={() => {
                          if (
                            formData.selectedDirectors.includes(director.id)
                          ) {
                            setFormData({
                              ...formData,
                              selectedDirectors:
                                formData.selectedDirectors.filter(
                                  (id) => id !== director.id
                                ),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              selectedDirectors: [
                                ...formData.selectedDirectors,
                                director.id,
                              ],
                            });
                          }
                        }}
                      />
                    ))}
                  </div>

                  <Link href="/directors">
                    <Button variant="ghost" className="w-full">
                      Alle Komponisten ansehen
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </motion.div>
              )}

              {/* Step 4: Budget & Submit */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-serif text-2xl mb-2">
                      Budget & Absenden
                    </h2>
                    <p className="text-muted-foreground">
                      Fast geschafft! Gib dein Budget an und sende den Auftrag
                      ab.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Budgetrahmen</Label>
                      <span className="text-sm font-medium text-primary">
                        €{formData.budgetMin} - €{formData.budgetMax}
                      </span>
                    </div>
                    <Slider
                      value={[formData.budgetMin, formData.budgetMax]}
                      min={50}
                      max={2000}
                      step={50}
                      onValueChange={([min, max]) =>
                        setFormData({
                          ...formData,
                          budgetMin: min,
                          budgetMax: max,
                        })
                      }
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>€50</span>
                      <span>€2.000</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Gewünschte Deadline (optional)</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData({ ...formData, deadline: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Zahlungsmodell</Label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Card
                        className={`cursor-pointer transition-all ${
                          formData.paymentModel === "PAY_ON_COMPLETION"
                            ? "border-primary"
                            : "border-border/50"
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            paymentModel: "PAY_ON_COMPLETION",
                          })
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                formData.paymentModel === "PAY_ON_COMPLETION"
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/50"
                              }`}
                            >
                              {formData.paymentModel === "PAY_ON_COMPLETION" && (
                                <Check className="w-3 h-3 text-primary-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                Zahlung nach Fertigstellung
                              </p>
                              <p className="text-xs text-muted-foreground">
                                100% bei Abnahme
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card
                        className={`cursor-pointer transition-all ${
                          formData.paymentModel === "PARTIAL_PAYMENT"
                            ? "border-primary"
                            : "border-border/50"
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            paymentModel: "PARTIAL_PAYMENT",
                          })
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                formData.paymentModel === "PARTIAL_PAYMENT"
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/50"
                              }`}
                            >
                              {formData.paymentModel === "PARTIAL_PAYMENT" && (
                                <Check className="w-3 h-3 text-primary-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">Teilzahlung</p>
                              <p className="text-xs text-muted-foreground">
                                30% Anzahlung, 70% bei Abnahme
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Summary */}
                  <Card className="bg-secondary/50 border-none">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Zusammenfassung</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Projekt</dt>
                          <dd>{formData.title || "-"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Genre</dt>
                          <dd>{formData.genres.join(", ") || "-"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Länge</dt>
                          <dd>
                            {Math.floor(formData.duration / 60)}:
                            {(formData.duration % 60)
                              .toString()
                              .padStart(2, "0")}{" "}
                            min
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Komponisten</dt>
                          <dd>{formData.selectedDirectors.length}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Budget</dt>
                          <dd className="text-primary font-medium">
                            €{formData.budgetMin} - €{formData.budgetMax}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          acceptTerms: checked as boolean,
                        })
                      }
                      className="mt-1"
                    />
                    <Label
                      htmlFor="terms"
                      className="text-sm font-normal leading-relaxed"
                    >
                      Ich akzeptiere die{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        AGB
                      </Link>{" "}
                      und die{" "}
                      <Link
                        href="/privacy"
                        className="text-primary hover:underline"
                      >
                        Datenschutzerklärung
                      </Link>
                      . Ich verstehe, dass die Komponisten unverbindliche
                      Angebote abgeben werden.
                    </Label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>

              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="bg-primary hover:bg-primary/90"
                >
                  Weiter
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      Auftrag absenden
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

