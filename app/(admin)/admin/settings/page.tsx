"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Globe,
  Euro,
  Mail,
  Shield,
  Bell,
  Palette,
  FileText,
  Save,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

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
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-serif text-4xl mb-2">Plattform-Einstellungen</h1>
            <p className="text-muted-foreground">
              Verwalte globale Einstellungen für die Musicify Plattform.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-primary-foreground"
          >
            {isSaving ? (
              <>
                <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
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

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-card/50">
            <TabsTrigger value="general">
              <Globe className="w-4 h-4 mr-2" />
              Allgemein
            </TabsTrigger>
            <TabsTrigger value="payments">
              <Euro className="w-4 h-4 mr-2" />
              Zahlungen
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="w-4 h-4 mr-2" />
              E-Mail
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Sicherheit
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <div className="space-y-6">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Plattform-Details</CardTitle>
                  <CardDescription>
                    Grundlegende Informationen über die Plattform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Plattform-Name</Label>
                      <Input defaultValue="Musicify" className="mt-1 bg-background" />
                    </div>
                    <div>
                      <Label>Support-E-Mail</Label>
                      <Input defaultValue="support@musicify.de" className="mt-1 bg-background" />
                    </div>
                  </div>
                  <div>
                    <Label>Plattform-Beschreibung</Label>
                    <Textarea
                      defaultValue="Premium Musik-Lizenzierung und Custom Music Plattform für Kreative und Unternehmen."
                      className="mt-1 bg-background"
                      rows={3}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Standard-Sprache</Label>
                      <Select defaultValue="de">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Zeitzone</Label>
                      <Select defaultValue="europe_berlin">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="europe_berlin">Europe/Berlin</SelectItem>
                          <SelectItem value="utc">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Funktionen</CardTitle>
                  <CardDescription>
                    Aktiviere oder deaktiviere Plattform-Funktionen.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marktplatz</p>
                      <p className="text-sm text-muted-foreground">
                        Erlaube Nutzern, Tracks zu kaufen
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Custom Music</p>
                      <p className="text-sm text-muted-foreground">
                        Erlaube Nutzern, individuelle Aufträge zu erstellen
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Neue Registrierungen</p>
                      <p className="text-sm text-muted-foreground">
                        Erlaube neuen Nutzern, sich zu registrieren
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Komponisten-Bewerbungen</p>
                      <p className="text-sm text-muted-foreground">
                        Erlaube Nutzern, sich als Komponist zu bewerben
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payments">
            <div className="space-y-6">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Zahlungseinstellungen</CardTitle>
                  <CardDescription>
                    Konfiguriere Zahlungsmethoden und Provisionen.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Plattform-Provision (%)</Label>
                      <Input type="number" defaultValue="15" className="mt-1 bg-background" />
                    </div>
                    <div>
                      <Label>Standard-Währung</Label>
                      <Select defaultValue="eur">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="usd">USD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <p className="font-medium mb-4">Zahlungsmethoden</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                            💳
                          </div>
                          <div>
                            <p className="font-medium">Kreditkarte (Stripe)</p>
                            <p className="text-sm text-muted-foreground">
                              Visa, Mastercard, AMEX
                            </p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                            🅿️
                          </div>
                          <div>
                            <p className="font-medium">PayPal</p>
                            <p className="text-sm text-muted-foreground">
                              Zahlungen via PayPal
                            </p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                            🔵
                          </div>
                          <div>
                            <p className="font-medium">Klarna</p>
                            <p className="text-sm text-muted-foreground">
                              Sofort bezahlen oder später
                            </p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Auszahlungen</CardTitle>
                  <CardDescription>
                    Einstellungen für Komponisten-Auszahlungen.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Mindestauszahlung (€)</Label>
                      <Input type="number" defaultValue="50" className="mt-1 bg-background" />
                    </div>
                    <div>
                      <Label>Auszahlungszyklus</Label>
                      <Select defaultValue="monthly">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Wöchentlich</SelectItem>
                          <SelectItem value="biweekly">Alle 2 Wochen</SelectItem>
                          <SelectItem value="monthly">Monatlich</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-serif">E-Mail-Einstellungen</CardTitle>
                <CardDescription>
                  Konfiguriere E-Mail-Benachrichtigungen.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Absender-Name</Label>
                    <Input defaultValue="Musicify" className="mt-1 bg-background" />
                  </div>
                  <div>
                    <Label>Absender-E-Mail</Label>
                    <Input defaultValue="noreply@musicify.de" className="mt-1 bg-background" />
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <p className="font-medium mb-4">E-Mail-Benachrichtigungen</p>
                  <div className="space-y-3">
                    {[
                      { label: "Neue Bestellungen", desc: "Benachrichtige Admins bei neuen Bestellungen" },
                      { label: "Neue Komponisten-Bewerbungen", desc: "Benachrichtige Admins bei Bewerbungen" },
                      { label: "Track-Einreichungen", desc: "Benachrichtige Admins bei neuen Tracks" },
                      { label: "Streitfälle", desc: "Benachrichtige Admins bei gemeldeten Problemen" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-serif">Sicherheitseinstellungen</CardTitle>
                <CardDescription>
                  Konfiguriere Sicherheits- und Datenschutzoptionen.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Zwei-Faktor-Authentifizierung (Admin)</p>
                    <p className="text-sm text-muted-foreground">
                      Erfordere 2FA für Admin-Konten
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Wartungsmodus</p>
                    <p className="text-sm text-muted-foreground">
                      Zeige Wartungsseite für alle Nutzer
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Aktivitätsprotokolle</p>
                    <p className="text-sm text-muted-foreground">
                      Protokolliere Admin-Aktivitäten
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">IP-Protokollierung</p>
                    <p className="text-sm text-muted-foreground">
                      Protokolliere IP-Adressen bei Anmeldungen
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

