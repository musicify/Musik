"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  ShoppingCart,
  Menu,
  X,
  User,
  LogIn,
  ChevronDown,
  Headphones,
  Mic2,
  LayoutDashboard,
  Settings,
  LogOut,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

const navigation = [
  {
    name: "Musik kaufen",
    href: "/marketplace",
    icon: Headphones,
    description: "Entdecke lizenzierte Tracks",
  },
  {
    name: "Musik auf Bestellung",
    href: "/custom-music",
    icon: Mic2,
    description: "Individuelle Musikproduktion",
  },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Mock auth state - replace with real auth
  const isLoggedIn = false;
  const cartItemCount = 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
              <Music className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-2xl tracking-tight">
              Musicify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </span>
                <div className="absolute inset-0 bg-secondary rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search */}
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="relative"
                >
                  <Input
                    type="search"
                    placeholder="Suchen..."
                    className="pr-8 bg-secondary/50"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </motion.div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Search className="w-5 h-5" />
                </Button>
              )}
            </AnimatePresence>

            {/* Cart */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Auth */}
            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-muted-foreground hover:text-foreground"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">Max Mustermann</p>
                      <p className="text-xs text-muted-foreground">
                        max@example.com
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Einstellungen
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Abmelden
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Anmelden
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-sm hover:shadow-glow transition-all">
                    Registrieren
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                      <Link
                        href="/"
                        className="flex items-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <Music className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-serif text-xl">Musicify</span>
                      </Link>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto p-6">
                    <div className="space-y-1">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary transition-colors"
                        >
                          <item.icon className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 border-t border-border space-y-3">
                    {isLoggedIn ? (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button variant="outline" className="w-full">
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                          </Button>
                        </Link>
                        <Button variant="ghost" className="w-full text-destructive">
                          <LogOut className="w-4 h-4 mr-2" />
                          Abmelden
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button variant="outline" className="w-full">
                            <LogIn className="w-4 h-4 mr-2" />
                            Anmelden
                          </Button>
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button className="w-full bg-primary text-primary-foreground">
                            Registrieren
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}

