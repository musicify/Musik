"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Bell,
  Lock,
  CreditCard,
  Globe,
  Palette,
  Save,
  Upload,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl mb-2">Einstellungen</h1>
          <p className="text-muted-foreground">
            Verwalte dein Konto und Präferenzen
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-2 h-auto p-1">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Benachrichtigungen</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Sicherheit</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Zahlung</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Präferenzen</span>
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
                  <CardTitle>Profil-Informationen</CardTitle>
                  <CardDescription>
                    Aktualisiere deine persönlichen Daten
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="bg-gradient-to-br from-primary/30 to-secondary/30 text-2xl font-serif">
                        M
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Bild hochladen
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG oder WebP. Max 5MB.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Vorname</Label>
                      <Input id="firstName" defaultValue="Max" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nachname</Label>
                      <Input id="lastName" defaultValue="Mustermann" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">E-Mail</Label>
                    <Input id="email" type="email" defaultValue="max@example.com" />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Erzähle etwas über dich..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">Firma (optional)</Label>
                    <Input id="company" placeholder="Firma GmbH" />
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
                    Wähle wie du benachrichtigt werden möchtest
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">E-Mail-Benachrichtigungen</p>
                        <p className="text-sm text-muted-foreground">
                          Erhalte Updates per E-Mail
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auftrags-Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Status-Änderungen deiner Aufträge
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Chat-Nachrichten</p>
                        <p className="text-sm text-muted-foreground">
                          Neue Nachrichten von Komponisten
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing</p>
                        <p className="text-sm text-muted-foreground">
                          News, Angebote und Updates
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push-Benachrichtigungen</p>
                        <p className="text-sm text-muted-foreground">
                          Browser-Benachrichtigungen
                        </p>
                      </div>
                      <Switch />
                    </div>
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
                  <CardDescription>
                    Aktualisiere dein Passwort regelmäßig
                  </CardDescription>
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
                  <CardDescription>
                    Zusätzliche Sicherheit für dein Konto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">2FA aktivieren</p>
                      <p className="text-sm text-muted-foreground">
                        Nutze eine Authenticator-App
                      </p>
                    </div>
                    <Button variant="outline">Einrichten</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50 border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-red-500">Gefahrenzone</CardTitle>
                  <CardDescription>
                    Diese Aktionen können nicht rückgängig gemacht werden
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Konto löschen
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Rechnungsadresse</CardTitle>
                  <CardDescription>
                    Wird für Rechnungen verwendet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billingName">Name</Label>
                      <Input id="billingName" defaultValue="Max Mustermann" />
                    </div>
                    <div>
                      <Label htmlFor="billingCompany">Firma</Label>
                      <Input id="billingCompany" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="billingAddress">Adresse</Label>
                    <Input id="billingAddress" placeholder="Straße & Hausnummer" />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="billingZip">PLZ</Label>
                      <Input id="billingZip" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="billingCity">Stadt</Label>
                      <Input id="billingCity" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="vatId">USt-IdNr.</Label>
                    <Input id="vatId" placeholder="DE123456789" />
                  </div>
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Speichern
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Zahlungsmethoden</CardTitle>
                  <CardDescription>
                    Verwalte deine Zahlungsmethoden
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">
                          Läuft ab 12/25
                        </p>
                      </div>
                    </div>
                    <Badge>Standard</Badge>
                  </div>
                  <Button variant="outline" className="mt-4">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Neue Karte hinzufügen
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Präferenzen</CardTitle>
                  <CardDescription>
                    Passe die App an deine Bedürfnisse an
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sprache</p>
                      <p className="text-sm text-muted-foreground">
                        Wähle deine bevorzugte Sprache
                      </p>
                    </div>
                    <Select defaultValue="de">
                      <SelectTrigger className="w-[180px]">
                        <Globe className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Dunkles Farbschema verwenden
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-Play</p>
                      <p className="text-sm text-muted-foreground">
                        Audio-Previews automatisch abspielen
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Kompakte Ansicht</p>
                      <p className="text-sm text-muted-foreground">
                        Weniger Abstände für mehr Inhalt
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Speichern
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

