import { useState } from "react";
import { SearchResort } from "./SearchResort";
import { WeatherDashboard } from "./WeatherDashboard";
import { useWeather, type Resort } from "@/hooks/use-weather";
import { Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function ResortComparison() {
  const [resort1, setResort1] = useState<Resort | null>(null);
  const [resort2, setResort2] = useState<Resort | null>(null);

  const weather1 = useWeather(resort1?.latitude ?? null, resort1?.longitude ?? null);
  const weather2 = useWeather(resort2?.latitude ?? null, resort2?.longitude ?? null);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Resort A</span>
            {resort1 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setResort1(null)}
                className="h-8 text-muted-foreground hover:text-white"
              >
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
            )}
          </div>
          <SearchResort onSelect={setResort1} />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Resort B</span>
            {resort2 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setResort2(null)}
                className="h-8 text-muted-foreground hover:text-white"
              >
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
            )}
          </div>
          <SearchResort onSelect={setResort2} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <AnimatePresence mode="wait">
          <div className="space-y-6">
            {weather1.isLoading ? (
              <div className="flex flex-col items-center py-20 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading Resort A...</p>
              </div>
            ) : resort1 && weather1.data ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <WeatherDashboard weather={weather1.data} resort={resort1} isCompact />
              </motion.div>
            ) : (
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-muted-foreground bg-white/[0.02]">
                Select a resort to compare
              </div>
            )}
          </div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <div className="space-y-6">
            {weather2.isLoading ? (
              <div className="flex flex-col items-center py-20 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading Resort B...</p>
              </div>
            ) : resort2 && weather2.data ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <WeatherDashboard weather={weather2.data} resort={resort2} isCompact />
              </motion.div>
            ) : (
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-muted-foreground bg-white/[0.02]">
                Select a second resort
              </div>
            )}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
