"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Tag,
  User,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const featuredPost = {
  id: "1",
  title: "Die Zukunft der Musiklizenzierung: KI, Blockchain und neue Geschäftsmodelle",
  excerpt:
    "Ein tiefer Einblick in die Trends, die die Musikindustrie revolutionieren werden. Von automatisierter Lizenzierung bis zu direkten Künstler-Fan-Beziehungen.",
  category: "Branche",
  author: "Lisa Müller",
  date: "2024-01-25",
  readTime: "8 min",
  gradient: "from-violet-500 to-purple-600",
};

const posts = [
  {
    id: "2",
    title: "10 Tipps für Komponisten: So maximierst du deine Einnahmen",
    excerpt: "Praktische Strategien, um mehr Tracks zu verkaufen und Custom Music Aufträge zu gewinnen.",
    category: "Für Künstler",
    author: "Max Schmidt",
    date: "2024-01-22",
    readTime: "5 min",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: "3",
    title: "Der perfekte Soundtrack: Musik für Corporate Videos auswählen",
    excerpt: "Wie du die richtige Musik für Unternehmensvideos findest und worauf du achten solltest.",
    category: "Guides",
    author: "Sarah Klein",
    date: "2024-01-20",
    readTime: "6 min",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "4",
    title: "Custom Music vs. Stock Music: Was ist die beste Wahl?",
    excerpt: "Ein Vergleich beider Optionen mit Vor- und Nachteilen für verschiedene Projekttypen.",
    category: "Guides",
    author: "Tom Weber",
    date: "2024-01-18",
    readTime: "7 min",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    id: "5",
    title: "Neue Komponisten im Januar: Frische Sounds entdecken",
    excerpt: "Wir stellen die neuesten Talente vor, die im Januar zu Musicify gestoßen sind.",
    category: "News",
    author: "Anna Hoffmann",
    date: "2024-01-15",
    readTime: "4 min",
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: "6",
    title: "Lizenzrecht für Einsteiger: Was du wissen musst",
    excerpt: "Ein verständlicher Guide zu Musiklizenzen, Urheberrecht und Nutzungsrechten.",
    category: "Guides",
    author: "Lisa Müller",
    date: "2024-01-12",
    readTime: "10 min",
    gradient: "from-amber-500 to-orange-600",
  },
];

const categories = [
  { name: "Alle", count: 24 },
  { name: "News", count: 8 },
  { name: "Guides", count: 10 },
  { name: "Für Künstler", count: 4 },
  { name: "Branche", count: 2 },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="absolute inset-0 pattern-dots opacity-20" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="w-3 h-3 mr-1" />
              Blog
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6">
              Insights & <span className="gradient-text">Stories</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              News, Tutorials und Einblicke aus der Welt der Musik und
              Lizenzierung.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Artikel suchen..."
                className="pl-12 h-12 bg-card/50 border-border/50"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-card border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={category.name === "Alle" ? "default" : "outline"}
                size="sm"
                className="flex-shrink-0"
              >
                {category.name}
                <span className="ml-2 text-xs opacity-60">{category.count}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link href={`/blog/${featuredPost.id}`}>
              <Card className="bg-card/50 border-border/50 overflow-hidden group cursor-pointer">
                <div className="grid md:grid-cols-2 gap-0">
                  <div
                    className={`aspect-[16/10] md:aspect-auto bg-gradient-to-br ${featuredPost.gradient} flex items-center justify-center`}
                  >
                    <span className="text-8xl opacity-30">📰</span>
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <Badge variant="secondary" className="w-fit mb-4">
                      {featuredPost.category}
                    </Badge>
                    <h2 className="font-serif text-2xl sm:text-3xl mb-4 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(featuredPost.date).toLocaleDateString("de-DE", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl">Neueste Artikel</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.id}`}>
                  <Card className="bg-background/50 border-border/50 overflow-hidden group cursor-pointer h-full">
                    <div
                      className={`aspect-[16/9] bg-gradient-to-br ${post.gradient} flex items-center justify-center`}
                    >
                      <span className="text-5xl opacity-30">📝</span>
                    </div>
                    <CardContent className="p-6">
                      <Badge variant="secondary" className="mb-3">
                        {post.category}
                      </Badge>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{post.author}</span>
                        <div className="flex items-center gap-3">
                          <span>
                            {new Date(post.date).toLocaleDateString("de-DE", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Mehr Artikel laden
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8 sm:p-12 text-center">
              <h2 className="font-serif text-3xl sm:text-4xl mb-4">
                Newsletter abonnieren
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Erhalte die neuesten Artikel, Tipps und exklusive Insights direkt
                in deinen Posteingang.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  placeholder="deine@email.de"
                  className="bg-background"
                />
                <Button className="bg-primary text-primary-foreground">
                  Abonnieren
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

