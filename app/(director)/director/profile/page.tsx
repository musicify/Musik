"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Save,
  Plus,
  X,
  Globe,
  Link as LinkIcon,
  Music,
  Euro,
  Languages,
  Briefcase,
  Settings2,
  Eye,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Mock profile data
const initialProfile = {
  name: "Max Müller",
  email: "max@musicify.de",
  image: null,
  bio: "Professioneller Komponist mit 10+ Jahren Erfahrung in der Filmmusik und Werbemusik. Spezialisiert auf orchestrale Arrangements, elektronische Produktionen und hybride Sounds.",
  specialization: ["Electronic", "Cinematic", "Ambient", "Pop"],
  priceRangeMin: 200,
  priceRangeMax: 2000,
  website: "https://maxmueller-music.de",
  socialLinks: [
    "https://soundcloud.com/maxmueller",
    "https://instagram.com/maxmueller_music",
  ],
  experience: "Über 10 Jahre professionelle Musikproduktion. Zusammenarbeit mit internationalen Werbeagenturen, Filmproduktionen und Künstlern. Mitglied in GEMA und VG Musikedition.",
  equipment: "Logic Pro X, Ableton Live 11, Native Instruments Komplete 14, Spitfire Audio Libraries, Universal Audio Apollo Twin, Neumann TLM 103",
  languages: ["Deutsch", "Englisch"],
  badges: ["VERIFIED", "PREMIUM"],
};

const availableGenres = [
  "Electronic", "Cinematic", "Ambient", "Pop", "Rock", "Hip-Hop", 
  "Classical", "Jazz", "R&B", "Indie", "Folk", "World"
];

const availableLanguages = [
  "Deutsch", "Englisch", "Französisch", "Spanisch", "Italienisch", "Russisch"
];

export default function DirectorProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [newSocialLink, setNewSocialLink] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Profil erfolgreich gespeichert");
    } catch (error) {
      toast.error("Fehler beim Speichern");
    } finally {
      setIsSaving(false);
    }
  };

  const addSpecialization = () => {
    if (newSpecialization && !profile.specialization.includes(newSpecialization)) {
      setProfile((prev) => ({
        ...prev,
        specialization: [...prev.specialization, newSpecialization],
      }));
      setNewSpecialization("");
    }
  };

  const removeSpecialization = (spec: string) => {
    setProfile((prev) => ({
      ...prev,
      specialization: prev.specialization.filter((s) => s !== spec),
    }));
  };

  const addSocialLink = () => {
    if (newSocialLink && !profile.socialLinks.includes(newSocialLink)) {
      setProfile((prev) => ({
        ...prev,
        socialLinks: [...prev.socialLinks, newSocialLink],
      }));
      setNewSocialLink("");
    }
  };

  const removeSocialLink = (link: string) => {
    setProfile((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((l) => l !== link),
    }));
  };

  const toggleLanguage = (lang: string) => {
    setProfile((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl mb-2">Profil bearbeiten</h1>
            <p className="text-muted-foreground">
              Verwalte dein öffentliches Profil und deine Einstellungen
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Vorschau
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? "Wird gespeichert..." : "Speichern"}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[300px,1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4">
                  <AvatarImage src={profile.image || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-4xl font-serif">
                    {profile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{profile.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{profile.email}</p>
                <div className="flex flex-wrap justify-center gap-1 mb-4">
                  {profile.badges.map((badge) => (
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
                      {badge}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Bild ändern
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Profilstärke
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Vollständigkeit</span>
                    <span className="text-primary">85%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Bio ausgefüllt
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Spezialisierungen angegeben
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    Portfolio-Tracks hinzufügen
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Grundinformationen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-Mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="mt-1 bg-muted"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Über mich</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    className="mt-1"
                    rows={4}
                    placeholder="Erzähle potenziellen Kunden etwas über dich und deine Arbeit..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {profile.bio.length}/500 Zeichen
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Specializations */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Spezialisierungen
                </CardTitle>
                <CardDescription>
                  Wähle die Genres und Stile, in denen du dich spezialisierst
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.specialization.map((spec) => (
                    <Badge
                      key={spec}
                      variant="secondary"
                      className="pl-3 pr-1 py-1.5"
                    >
                      {spec}
                      <button
                        onClick={() => removeSpecialization(spec)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <select
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  >
                    <option value="">Genre auswählen...</option>
                    {availableGenres
                      .filter((g) => !profile.specialization.includes(g))
                      .map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addSpecialization}
                    disabled={!newSpecialization}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="w-5 h-5" />
                  Preisrahmen
                </CardTitle>
                <CardDescription>
                  Gib deinen typischen Preisrahmen für Aufträge an
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priceMin">Minimum (€)</Label>
                    <Input
                      id="priceMin"
                      type="number"
                      value={profile.priceRangeMin}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          priceRangeMin: Number(e.target.value),
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priceMax">Maximum (€)</Label>
                    <Input
                      id="priceMax"
                      type="number"
                      value={profile.priceRangeMax}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          priceRangeMax: Number(e.target.value),
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Dieser Preisrahmen wird auf deinem öffentlichen Profil angezeigt (z.B. "ab €{profile.priceRangeMin}")
                </p>
              </CardContent>
            </Card>

            {/* Experience & Equipment */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Erfahrung & Equipment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="experience">Erfahrung</Label>
                  <Textarea
                    id="experience"
                    value={profile.experience}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, experience: e.target.value }))
                    }
                    className="mt-1"
                    rows={3}
                    placeholder="Beschreibe deine berufliche Erfahrung..."
                  />
                </div>
                <div>
                  <Label htmlFor="equipment">Equipment</Label>
                  <Textarea
                    id="equipment"
                    value={profile.equipment}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, equipment: e.target.value }))
                    }
                    className="mt-1"
                    rows={2}
                    placeholder="Welche DAWs, Plugins und Hardware nutzt du?"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  Sprachen
                </CardTitle>
                <CardDescription>
                  In welchen Sprachen kannst du mit Kunden kommunizieren?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {availableLanguages.map((lang) => (
                    <Badge
                      key={lang}
                      variant={profile.languages.includes(lang) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleLanguage(lang)}
                    >
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  Links & Social Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <div className="relative mt-1">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="website"
                      value={profile.website}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, website: e.target.value }))
                      }
                      className="pl-10"
                      placeholder="https://deine-website.de"
                    />
                  </div>
                </div>

                <div>
                  <Label>Social Media</Label>
                  <div className="space-y-2 mt-2">
                    {profile.socialLinks.map((link) => (
                      <div key={link} className="flex items-center gap-2">
                        <Input value={link} readOnly className="flex-1 bg-muted" />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSocialLink(link)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newSocialLink}
                        onChange={(e) => setNewSocialLink(e.target.value)}
                        placeholder="https://soundcloud.com/..."
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={addSocialLink}
                        disabled={!newSocialLink}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Hinzufügen
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

