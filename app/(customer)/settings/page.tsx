"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Bell,
  CreditCard,
  Shield,
  Globe,
  Palette,
  Trash2,
  Save,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock user data
const user = {
  name: "Max Mustermann",
  email: "max@example.de",
  company: "Musterfirma GmbH",
  avatar: null,
  memberSince: "Januar 2024",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    orderUpdates: true,
    marketing: false,
    newMusic: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
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
          <h1 className="font-serif text-4xl mb-2">Einstellungen</h1>
          <p className="text-muted-foreground">
            Verwalte dein Konto und deine Präferenzen
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[250px,1fr] gap-8">
          {/* Sidebar Navigation */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <Card className="bg-card/50 border-border/50 sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {[
                    { id: "profile", label: "Profil", icon: User },
                    { id: "notifications", label: "Benachrichtigungen", icon: Bell },
                    { id: "security", label: "Sicherheit", icon: Lock },
                    { id: "billing", label: "Zahlungen", icon: CreditCard },
                    { id: "preferences", label: "Präferenzen", icon: Palette },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeTab === item.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Mobile Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="lg:hidden mb-6"
            >
              <TabsList className="w-full grid grid-cols-5 bg-card/50">
                <TabsTrigger value="profile" className="text-xs">Profil</TabsTrigger>
                <TabsTrigger value="notifications" className="text-xs">Benachrichtigungen</TabsTrigger>
                <TabsTrigger value="security" className="text-xs">Sicherheit</TabsTrigger>
                <TabsTrigger value="billing" className="text-xs">Zahlungen</TabsTrigger>
                <TabsTrigger value="preferences" className="text-xs">Präferenzen</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle>Profil</CardTitle>
                    <CardDescription>
                      Deine persönlichen Informationen
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={user.avatar || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-serif">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" size="sm">
                          Bild ändern
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          JPG, PNG oder GIF. Max 2MB.
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Form Fields */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          defaultValue={user.name}
                          className="mt-1 bg-background"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-Mail</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={user.email}
                          className="mt-1 bg-background"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="company">Firma (optional)</Label>
                        <Input
                          id="company"
                          defaultValue={user.company}
                          className="mt-1 bg-background"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
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
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Benachrichtigungen</CardTitle>
                  <CardDescription>
                    Entscheide, welche Benachrichtigungen du erhalten möchtest
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    {
                      id: "email",
                      label: "E-Mail-Benachrichtigungen",
                      description: "Erhalte wichtige Updates per E-Mail",
                    },
                    {
                      id: "orderUpdates",
                      label: "Auftrags-Updates",
                      description: "Benachrichtigungen zu deinen laufenden Aufträgen",
                    },
                    {
                      id: "newMusic",
                      label: "Neue Musik",
                      description: "Erfahre von neuen Tracks deiner Lieblingskünstler",
                    },
                    {
                      id: "marketing",
                      label: "Marketing",
                      description: "Angebote, Rabatte und Newsletter",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        checked={notifications[item.id as keyof typeof notifications]}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            [item.id]: checked,
                          }))
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle>Passwort ändern</CardTitle>
                    <CardDescription>
                      Aktualisiere dein Passwort regelmäßig für mehr Sicherheit
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                      <div className="relative mt-1">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          className="bg-background pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="newPassword">Neues Passwort</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        className="mt-1 bg-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="mt-1 bg-background"
                      />
                    </div>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Passwort ändern
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle>Zwei-Faktor-Authentifizierung</CardTitle>
                    <CardDescription>
                      Füge eine zusätzliche Sicherheitsebene hinzu
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">2FA aktivieren</p>
                        <p className="text-sm text-muted-foreground">
                          Schütze dein Konto mit einer Authenticator-App
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle>Zahlungsmethoden</CardTitle>
                    <CardDescription>
                      Verwalte deine gespeicherten Zahlungsmethoden
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-secondary rounded flex items-center justify-center text-xs font-bold">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">
                            Läuft ab 12/25
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Entfernen
                      </Button>
                    </div>
                    <Button variant="outline">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Zahlungsmethode hinzufügen
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle>Rechnungsadresse</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Label>Straße & Hausnummer</Label>
                        <Input
                          defaultValue="Musterstraße 123"
                          className="mt-1 bg-background"
                        />
                      </div>
                      <div>
                        <Label>PLZ</Label>
                        <Input defaultValue="12345" className="mt-1 bg-background" />
                      </div>
                      <div>
                        <Label>Stadt</Label>
                        <Input defaultValue="Berlin" className="mt-1 bg-background" />
                      </div>
                      <div className="sm:col-span-2">
                        <Label>Land</Label>
                        <Input
                          defaultValue="Deutschland"
                          className="mt-1 bg-background"
                        />
                      </div>
                    </div>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Save className="w-4 h-4 mr-2" />
                      Adresse speichern
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle>Darstellung</CardTitle>
                    <CardDescription>
                      Passe das Erscheinungsbild der Plattform an
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Design</p>
                        <p className="text-sm text-muted-foreground">
                          Wähle zwischen Hell und Dunkel
                        </p>
                      </div>
                      <Select defaultValue="dark">
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Hell</SelectItem>
                          <SelectItem value="dark">Dunkel</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sprache</p>
                        <p className="text-sm text-muted-foreground">
                          Wähle deine bevorzugte Sprache
                        </p>
                      </div>
                      <Select defaultValue="de">
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="bg-card/50 border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-destructive">Gefahrenzone</CardTitle>
                    <CardDescription>
                      Irreversible Aktionen für dein Konto
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Konto löschen
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Konto wirklich löschen?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Diese Aktion kann nicht rückgängig gemacht werden.
                            Alle deine Daten, Käufe und Lizenzen werden dauerhaft
                            gelöscht.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Konto löschen
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.main>
        </div>
      </div>
    </div>
  );
}
