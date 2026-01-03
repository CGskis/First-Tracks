import { useState } from "react";
import { SearchResort } from "@/components/SearchResort";
import { WeatherDashboard } from "@/components/WeatherDashboard";
import { ResortComparison } from "@/components/ResortComparison";
import { useWeather, type Resort } from "@/hooks/use-weather";
import { Loader2, Snowflake, LayoutGrid, ArrowLeftRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  
  const { data: weather, isLoading, error } = useWeather(
    selectedResort?.latitude ?? null,
    selectedResort?.longitude ?? null
  );

  return (
    <div className="min-h-screen w-full px-4 py-8 md:px-8 lg:px-12 flex flex-col">
      {/* Header / Nav Area */}
      <header className="w-full flex justify-between items-center mb-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-primary cursor-pointer" onClick={() => {
          setSelectedResort(null);
          setIsComparing(false);
        }}>
          <div className="p-2 bg-primary/10 rounded-xl">
            <Snowflake className="w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">PowderWatch</span>
        </div>

        <Button 
          variant={isComparing ? "default" : "outline"}
          size="sm"
          onClick={() => setIsComparing(!isComparing)}
          className="gap-2 rounded-xl border-white/10 h-10 px-4"
        >
          {isComparing ? <LayoutGrid className="w-4 h-4" /> : <ArrowLeftRight className="w-4 h-4" />}
          <span>{isComparing ? "Single View" : "Compare Resorts"}</span>
        </Button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
        <AnimatePresence mode="wait">
          {isComparing ? (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-12 space-y-4">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white">Resort Comparison</h2>
                <p className="text-muted-foreground">Select two mountains to compare conditions side-by-side.</p>
              </div>
              <ResortComparison />
            </motion.div>
          ) : (
            <motion.div
              key="single"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col"
            >
              {/* Search Section */}
              <div className={`transition-all duration-500 ease-out ${selectedResort ? 'mb-8' : 'flex-1 flex flex-col justify-center mb-32'}`}>
                {!selectedResort && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10 space-y-4"
                  >
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                      Chase the Snow
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                      Real-time overnight weather forecasts for skiers. Find out exactly how much snow will be waiting for you in the morning.
                    </p>
                  </motion.div>
                )}
                
                <SearchResort onSelect={setSelectedResort} />
              </div>

              {/* Results Section */}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full flex justify-center items-center py-20"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      <p className="text-muted-foreground font-medium">Fetching forecast...</p>
                    </div>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full text-center py-20"
                  >
                    <p className="text-destructive text-lg">Failed to load weather data. Please try again.</p>
                  </motion.div>
                ) : selectedResort && weather ? (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <WeatherDashboard weather={weather} resort={selectedResort} />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-sm text-muted-foreground border-t border-white/5 mt-auto">
        <p>© 2024 PowderWatch. Data powered by Open-Meteo.</p>
      </footer>
    </div>
  );
}
