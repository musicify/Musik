"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Music,
  Euro,
  Bell,
  Globe,
  Award,
  Save,
  Plus,
  X,
  Link as LinkIcon,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Mock director data
const director = {
  name: "Max Müller",
  email: "max@example.de",
  bio: "Spezialisiert auf Electronic und Cinematic Music mit über 10 Jahren Erfahrung in der Musikproduktion.",
  avatarGradient: "from-violet-500 to-purple-600",
  specializations: ["Electronic", "Cinematic", "Synthwave", "Ambient"],
  priceRange: { min: 200, max: 2500 },
  languages: ["Deutsch", "Englisch"],
  equipment: ["Ableton Live", "Native Instruments", "U-He Synths"],
  social: {
    website: "https://maxmuller.de",
    instagram: "@maxmuller_music",
  },
  avgResponseTime: 2,
  location: "Berlin, Deutschland",
};

const allSpecializations = [
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
  "Synthwave",
  "Orchestral",
  "R&B",
  "Indie",
];

export default function DirectorSettingsPage() {
  const [specializations, setSpecializations] = useState(director.specializations);
  const [priceRange, setPriceRange] = useState([director.priceRange.min, director.priceRange.max]);
  const [isSaving, setIsSaving] = useState(false);

  const [notifications, setNotifications] = useState({
    newOrders: true,
    messages: true,
    reviews: true,
    marketing: false,
  });

  const toggleSpecialization = (spec: string) => {
    setSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-4xl mb-2">Profil & Einstellungen</h1>
          <p className="text-muted-foreground">
            Verwalte dein Komponisten-Profil und deine Präferenzen
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr,350px] gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Profile */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Profil</CardTitle>
                <CardDescription>
                  Deine öffentlichen Profil-Informationen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback
                      className={`bg-gradient-to-br ${director.avatarGradient} text-white text-2xl font-serif`}
                    >
                      {director.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Profilbild ändern
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      JPG oder PNG, mindestens 400x400 Pixel
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Künstlername</Label>
                    <Input
                      id="name"
                      defaultValue={director.name}
                      className="mt-1 bg-background"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Standort</Label>
                    <Input
                      id="location"
                      defaultValue={director.location}
                      className="mt-1 bg-background"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Über mich</Label>
                  <Textarea
                    id="bio"
                    defaultValue={director.bio}
                    className="mt-1 bg-background"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Beschreibe dich und deine Arbeit (max. 500 Zeichen)
                  </p>
                </div>

                <div>
                  <Label className="mb-3 block">Sprachen</Label>
                  <div className="flex flex-wrap gap-2">
                    {director.languages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="px-3 py-1">
                        {lang}
                        <button className="ml-2 hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      <Plus className="w-3 h-3 mr-1" />
                      Hinzufügen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specializations */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Spezialisierungen</CardTitle>
                <CardDescription>
                  Wähle deine Genres und Stile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allSpecializations.map((spec) => (
                    <button
                      key={spec}
                      onClick={() => toggleSpecialization(spec)}
                      className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                        specializations.includes(spec)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Preisgestaltung</CardTitle>
                <CardDescription>
                  Definiere deinen Preisrahmen für Custom Music
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-4 block">
                    Preisrahmen: €{priceRange[0]} – €{priceRange[1]}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={50}
                    max={5000}
                    step={50}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>€50</span>
                    <span>€5.000</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Dieser Preisrahmen wird auf deinem Profil angezeigt und hilft
                  Kunden, passende Komponisten zu finden.
                </p>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Social Media & Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <div className="relative mt-1">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="website"
                      defaultValue={director.social.website}
                      className="pl-10 bg-background"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="relative mt-1">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="instagram"
                      defaultValue={director.social.instagram}
                      className="pl-10 bg-background"
                    />
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
            {/* Notifications */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Benachrichtigungen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: "newOrders", label: "Neue Aufträge", description: "Bei neuen Kundenanfragen" },
                  { id: "messages", label: "Nachrichten", description: "Bei neuen Chat-Nachrichten" },
                  { id: "reviews", label: "Bewertungen", description: "Bei neuen Kundenbewertungen" },
                  { id: "marketing", label: "Marketing", description: "Newsletter und Angebote" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch
                      checked={notifications[item.id as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, [item.id]: checked }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Badge Status */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Dein Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                  <Award className="w-10 h-10 text-primary" />
                  <div>
                    <Badge className="badge-premium mb-1">PREMIUM</Badge>
                    <p className="text-xs text-muted-foreground">
                      Premium Komponist seit Januar 2024
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Projekte</span>
                    <span>127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bewertung</span>
                    <span>4.9 ★</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Erfolgsrate</span>
                    <span>98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Equipment */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Equipment & Software</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {director.equipment.map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                      <button className="ml-2 hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Equipment hinzufügen..."
                  className="bg-background"
                />
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Speichern...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Änderungen speichern
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
