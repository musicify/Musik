"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock users data
const mockUsers = [
  {
    id: "1",
    name: "Anna Schmidt",
    email: "anna@example.de",
    role: "CUSTOMER",
    status: "ACTIVE",
    orders: 5,
    spent: 245,
    joinedAt: "2024-01-15",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: "2",
    name: "Max Weber",
    email: "max@example.de",
    role: "DIRECTOR",
    status: "ACTIVE",
    orders: 0,
    spent: 0,
    joinedAt: "2024-01-10",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    id: "3",
    name: "Julia Braun",
    email: "julia@example.de",
    role: "CUSTOMER",
    status: "ACTIVE",
    orders: 12,
    spent: 890,
    joinedAt: "2023-12-20",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "4",
    name: "Tom Fischer",
    email: "tom@example.de",
    role: "CUSTOMER",
    status: "SUSPENDED",
    orders: 2,
    spent: 78,
    joinedAt: "2024-01-18",
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: "5",
    name: "Sarah Klein",
    email: "sarah@example.de",
    role: "DIRECTOR",
    status: "PENDING",
    orders: 0,
    spent: 0,
    joinedAt: "2024-01-25",
    gradient: "from-emerald-500 to-green-600",
  },
];

const stats = [
  { label: "Gesamt", value: 5234, change: "+18%" },
  { label: "Kunden", value: 5182, change: "+20%" },
  { label: "Komponisten", value: 52, change: "+4" },
  { label: "Gesperrt", value: 8, change: "-2" },
];

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-4xl mb-2">Nutzerverwaltung</h1>
          <p className="text-muted-foreground">
            Verwalte Kunden und Komponisten auf der Plattform.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-serif">{stat.value.toLocaleString()}</p>
                <p className="text-xs text-green-500">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="bg-card/50 border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Suche nach Namen oder E-Mail..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Rolle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Rollen</SelectItem>
                  <SelectItem value="customer">Kunden</SelectItem>
                  <SelectItem value="director">Komponisten</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="pending">Ausstehend</SelectItem>
                  <SelectItem value="suspended">Gesperrt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nutzer</TableHead>
                  <TableHead>Rolle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Bestellungen</TableHead>
                  <TableHead>Umsatz</TableHead>
                  <TableHead>Beigetreten</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback
                            className={`bg-gradient-to-br ${user.gradient} text-white text-xs`}
                          >
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.role === "DIRECTOR" ? "Komponist" : "Kunde"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.status === "ACTIVE"
                            ? "bg-green-500/20 text-green-500"
                            : user.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-red-500/20 text-red-500"
                        }
                      >
                        {user.status === "ACTIVE"
                          ? "Aktiv"
                          : user.status === "PENDING"
                          ? "Ausstehend"
                          : "Gesperrt"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.orders}</TableCell>
                    <TableCell>€{user.spent}</TableCell>
                    <TableCell>
                      {new Date(user.joinedAt).toLocaleDateString("de-DE")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            E-Mail senden
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Details ansehen
                          </DropdownMenuItem>
                          {user.status === "ACTIVE" ? (
                            <DropdownMenuItem className="text-red-500">
                              <UserX className="w-4 h-4 mr-2" />
                              Sperren
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-green-500">
                              <Shield className="w-4 h-4 mr-2" />
                              Aktivieren
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Zeige 1-5 von 5.234 Nutzern
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="ghost" size="sm">2</Button>
            <Button variant="ghost" size="sm">3</Button>
            <span className="text-muted-foreground">...</span>
            <Button variant="ghost" size="sm">523</Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

