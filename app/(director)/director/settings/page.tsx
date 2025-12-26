"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Lock,
  Wallet,
  Palette,
  Save,
  Upload,
  Award,
  Music,
  Plus,
  X,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GENRES, MOODS } from "@/lib/constants";

export default function DirectorSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [specializations, setSpecializations] = useState(["Electronic", "Cinematic"]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const addSpecialization = (genre: string) => {
    if (!specializations.includes(genre)) {
      setSpecializations([...specializations, genre]);
    }
  };

  const removeSpecialization = (genre: string) => {
    setSpecializations(specializations.filter((s) => s !== genre));
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl mb-2">Einstellungen</h1>
          <p className="text-muted-foreground">
            Verwalte dein Komponisten-Profil und Präferenzen
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-2 h-auto p-1">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="payouts" className="gap-2">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Auszahlung</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Benachrichtigungen</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Sicherheit</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Öffentliches Profil</CardTitle>
                      <CardDescription>
                        So sehen dich Kunden auf der Plattform
                      </CardDescription>
                    </div>
                    <Badge className="badge-verified">
                      <Award className="w-3 h-3 mr-1" />
                      VERIFIED
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-3xl font-serif">
                        M
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Profilbild ändern
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Quadratisches Bild empfohlen. Max 5MB.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="displayName">Künstlername</Label>
                    <Input id="displayName" defaultValue="Max Müller" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Dieser Name wird öffentlich angezeigt
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Erzähle etwas über dich und deine Musik..."
                      rows={4}
                      defaultValue="Spezialist für Electronic und Cinematic Music mit über 10 Jahren Erfahrung."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Max. 500 Zeichen
                    </p>
                  </div>

                  <div>
                    <Label>Spezialisierungen</Label>
                    <div className="flex flex-wrap gap-2 mt-2 mb-3">
                      {specializations.map((spec) => (
                        <Badge key={spec} variant="secondary" className="gap-1">
                          {spec}
                          <button
                            onClick={() => removeSpecialization(spec)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Select onValueChange={addSpecialization}>
                      <SelectTrigger className="w-[200px]">
                        <Plus className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Genre hinzufügen" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENRES.filter((g) => !specializations.includes(g)).map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Speichern...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Änderungen speichern
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Preise & Verfügbarkeit</CardTitle>
                  <CardDescription>
                    Definiere deine Preisstruktur für Custom Music
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priceMin">Mindestpreis (€)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="priceMin"
                          type="number"
                          className="pl-9"
                          defaultValue="200"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="priceMax">Maximalpreis (€)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="priceMax"
                          type="number"
                          className="pl-9"
                          defaultValue="800"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deliveryTime">Standardlieferzeit (Tage)</Label>
                    <Input
                      id="deliveryTime"
                      type="number"
                      defaultValue="7"
                      className="w-32"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Neue Aufträge annehmen</p>
                      <p className="text-sm text-muted-foreground">
                        Deaktivieren um keine neuen Anfragen zu erhalten
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Express-Lieferung anbieten</p>
                      <p className="text-sm text-muted-foreground">
                        Schnellere Lieferung gegen Aufpreis
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Stems/Projektdateien anbieten</p>
                      <p className="text-sm text-muted-foreground">
                        Zusätzliche Dateien für Kunden
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Speichern
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Payouts Tab */}
          <TabsContent value="payouts">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Auszahlungsmethode</CardTitle>
                  <CardDescription>
                    Wie möchtest du deine Einnahmen erhalten?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Aktuelles Guthaben</p>
                      <p className="text-2xl font-serif text-primary">€1,234.56</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Nächste Auszahlung: 01.02.2024
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="payoutMethod">Auszahlungsmethode</Label>
                    <Select defaultValue="bank">
                      <SelectTrigger id="payoutMethod">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">Banküberweisung</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="iban">IBAN</Label>
                    <Input id="iban" placeholder="DE89 3704 0044 0532 0130 00" />
                  </div>

                  <div>
                    <Label htmlFor="bic">BIC</Label>
                    <Input id="bic" placeholder="COBADEFFXXX" />
                  </div>

                  <div>
                    <Label htmlFor="accountHolder">Kontoinhaber</Label>
                    <Input id="accountHolder" defaultValue="Max Müller" />
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="taxId">Steuernummer</Label>
                    <Input id="taxId" placeholder="12/345/67890" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Für die Rechnungsstellung erforderlich
                    </p>
                  </div>

                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Speichern
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Benachrichtigungen</CardTitle>
                  <CardDescription>
                    Wähle wie du über neue Aufträge informiert wirst
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">E-Mail-Benachrichtigungen</p>
                      <p className="text-sm text-muted-foreground">
                        Allgemeine Updates per E-Mail
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Neue Auftragsanfragen</p>
                      <p className="text-sm text-muted-foreground">
                        Sofortige Benachrichtigung bei neuen Anfragen
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Chat-Nachrichten</p>
                      <p className="text-sm text-muted-foreground">
                        Neue Nachrichten von Kunden
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Zahlungseingänge</p>
                      <p className="text-sm text-muted-foreground">
                        Benachrichtigung bei neuen Einnahmen
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marktplatz-Verkäufe</p>
                      <p className="text-sm text-muted-foreground">
                        Wenn jemand deinen Track kauft
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Speichern
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Passwort ändern</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Neues Passwort</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button>Passwort ändern</Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Zwei-Faktor-Authentifizierung</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">2FA aktivieren</p>
                      <p className="text-sm text-muted-foreground">
                        Zusätzlicher Schutz für dein Konto
                      </p>
                    </div>
                    <Button variant="outline">Einrichten</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

