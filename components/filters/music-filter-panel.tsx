"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  X,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  GENRES,
  MOODS,
  USE_CASES,
  ERAS,
  LICENSE_TYPES,
} from "@/lib/constants";

export interface MusicFilterValues {
  genres: string[];
  moods: string[];
  useCases: string[];
  eras: string[];
  licenseTypes: string[];
  priceRange: [number, number];
  durationRange: [number, number];
}

interface MusicFilterPanelProps {
  filters: MusicFilterValues;
  onFilterChange: (filters: MusicFilterValues) => void;
  onReset: () => void;
  resultCount?: number;
}

const defaultFilters: MusicFilterValues = {
  genres: [],
  moods: [],
  useCases: [],
  eras: [],
  licenseTypes: [],
  priceRange: [0, 500],
  durationRange: [0, 600],
};

function FilterSection({
  title,
  options,
  selected,
  onChange,
  maxHeight = 200,
}: {
  title: string;
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxHeight?: number;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-sm font-medium hover:text-foreground transition-colors">
        <span className="flex items-center gap-2">
          {title}
          {selected.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {selected.length}
            </Badge>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ScrollArea className="pr-3" style={{ maxHeight }}>
          <div className="space-y-2 pb-3">
            {options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${title}-${option}`}
                  checked={selected.includes(option)}
                  onCheckedChange={() => toggleOption(option)}
                />
                <Label
                  htmlFor={`${title}-${option}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
}

function FilterContent({
  filters,
  onFilterChange,
  onReset,
  resultCount,
}: MusicFilterPanelProps) {
  const activeFilterCount =
    filters.genres.length +
    filters.moods.length +
    filters.useCases.length +
    filters.eras.length +
    filters.licenseTypes.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ? 1 : 0) +
    (filters.durationRange[0] > 0 || filters.durationRange[1] < 600 ? 1 : 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="font-medium">Filter</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Zurücksetzen
          </Button>
        )}
      </div>

      {/* Active Filters */}
      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-1.5 py-3 border-b border-border">
              {[
                ...filters.genres,
                ...filters.moods,
                ...filters.useCases,
                ...filters.eras,
                ...filters.licenseTypes,
              ].map((filter) => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="h-6 pr-1 cursor-pointer hover:bg-secondary/80"
                  onClick={() => {
                    // Remove from whichever array it's in
                    onFilterChange({
                      ...filters,
                      genres: filters.genres.filter((g) => g !== filter),
                      moods: filters.moods.filter((m) => m !== filter),
                      useCases: filters.useCases.filter((u) => u !== filter),
                      eras: filters.eras.filter((e) => e !== filter),
                      licenseTypes: filters.licenseTypes.filter((l) => l !== filter),
                    });
                  }}
                >
                  {filter}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Sections */}
      <ScrollArea className="flex-1 -mx-1 px-1">
        <div className="divide-y divide-border">
          <FilterSection
            title="Genre"
            options={GENRES}
            selected={filters.genres}
            onChange={(genres) => onFilterChange({ ...filters, genres })}
          />
          <FilterSection
            title="Stimmung"
            options={MOODS}
            selected={filters.moods}
            onChange={(moods) => onFilterChange({ ...filters, moods })}
          />
          <FilterSection
            title="Verwendung"
            options={USE_CASES}
            selected={filters.useCases}
            onChange={(useCases) => onFilterChange({ ...filters, useCases })}
          />
          <FilterSection
            title="Epoche"
            options={ERAS}
            selected={filters.eras}
            onChange={(eras) => onFilterChange({ ...filters, eras })}
          />
          <FilterSection
            title="Lizenz"
            options={LICENSE_TYPES.map((l) => l.name)}
            selected={filters.licenseTypes}
            onChange={(licenseTypes) =>
              onFilterChange({ ...filters, licenseTypes })
            }
          />

          {/* Price Range */}
          <div className="py-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Preis</span>
              <span className="text-sm text-muted-foreground">
                €{filters.priceRange[0]} - €{filters.priceRange[1]}
              </span>
            </div>
            <Slider
              value={filters.priceRange}
              min={0}
              max={500}
              step={10}
              onValueChange={(value) =>
                onFilterChange({
                  ...filters,
                  priceRange: value as [number, number],
                })
              }
              className="mb-2"
            />
          </div>

          {/* Duration Range */}
          <div className="py-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Dauer</span>
              <span className="text-sm text-muted-foreground">
                {Math.floor(filters.durationRange[0] / 60)}:
                {(filters.durationRange[0] % 60).toString().padStart(2, "0")} -{" "}
                {Math.floor(filters.durationRange[1] / 60)}:
                {(filters.durationRange[1] % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <Slider
              value={filters.durationRange}
              min={0}
              max={600}
              step={30}
              onValueChange={(value) =>
                onFilterChange({
                  ...filters,
                  durationRange: value as [number, number],
                })
              }
              className="mb-2"
            />
          </div>
        </div>
      </ScrollArea>

      {/* Results Count */}
      {resultCount !== undefined && (
        <div className="pt-4 border-t border-border mt-auto">
          <p className="text-sm text-muted-foreground text-center">
            {resultCount} {resultCount === 1 ? "Track" : "Tracks"} gefunden
          </p>
        </div>
      )}
    </div>
  );
}

// Desktop Sidebar Version
export function MusicFilterPanel(props: MusicFilterPanelProps) {
  return (
    <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
      <div className="sticky top-24 bg-card rounded-xl border border-border p-4 max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col">
        <FilterContent {...props} />
      </div>
    </div>
  );
}

// Mobile Sheet Version
export function MusicFilterSheet(props: MusicFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount =
    props.filters.genres.length +
    props.filters.moods.length +
    props.filters.useCases.length +
    props.filters.eras.length +
    props.filters.licenseTypes.length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filter
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 px-1.5">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-4">
        <SheetHeader className="sr-only">
          <SheetTitle>Filter</SheetTitle>
        </SheetHeader>
        <FilterContent {...props} />
      </SheetContent>
    </Sheet>
  );
}

export { defaultFilters };

