import { type WeatherData, type Resort } from "@/hooks/use-weather";
import { Card } from "@/components/ui/card";
import { 
  CloudSnow, 
  Wind, 
  ThermometerSnowflake, 
  Mountain, 
  Droplets,
  CloudRain,
  Snowflake,
  Sun,
  Moon
} from "lucide-react";
import { motion } from "framer-motion";

interface WeatherDashboardProps {
  weather: WeatherData;
  resort: Resort;
}

export function WeatherDashboard({ weather, resort }: WeatherDashboardProps) {
  const isPowderDay = weather.snowfall > 2;
  const isFreezing = weather.temperature < 32;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-end pb-4 border-b border-white/10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-primary mb-1"
          >
            <MapPinIcon className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wider uppercase">{resort.country}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70"
          >
            {resort.name}
          </motion.h1>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
        >
          {weather.isNight ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
          <span className="text-sm font-medium">
            {weather.isNight ? "Overnight Forecast" : "Daytime Forecast"}
          </span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Temperature Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-1 md:col-span-2 lg:col-span-1"
        >
          <Card className="h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <div className="p-6 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground font-medium">Temp</span>
                <ThermometerSnowflake className={`w-6 h-6 ${isFreezing ? "text-cyan-400" : "text-orange-400"}`} />
              </div>
              <div className="mt-4">
                <div className="text-5xl font-display font-bold tracking-tight">
                  {Math.round(weather.temperature)}°<span className="text-2xl text-muted-foreground ml-1">F</span>
                </div>
                {weather.apparentTemperature !== undefined && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Feels like {Math.round(weather.apparentTemperature)}°F
                  </div>
                )}
                <div className="text-sm text-muted-foreground mt-1 capitalize">
                  {weather.description}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Snowfall Card - Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-1 md:col-span-2 lg:col-span-2"
        >
          <Card className={`h-full relative overflow-hidden ${isPowderDay ? "border-primary/50 bg-primary/5" : ""}`}>
            {isPowderDay && (
              <div className="absolute top-0 right-0 p-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)] animate-pulse">
                  <Snowflake className="w-3 h-3" /> POWDER ALERT
                </span>
              </div>
            )}
            
            <div className="p-6 h-full flex flex-col justify-between relative z-10">
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground font-medium">Snowfall (Overnight)</span>
                <CloudSnow className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-baseline gap-4 mt-2">
                <div className="text-6xl font-display font-bold text-white drop-shadow-lg">
                  {weather.snowfall}<span className="text-2xl text-muted-foreground ml-1">in</span>
                </div>
                {weather.rain > 0 && (
                  <div className="flex items-center gap-1 text-blue-400">
                    <CloudRain className="w-4 h-4" />
                    <span className="text-lg font-medium">{weather.rain}in rain</span>
                  </div>
                )}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {weather.snowfall > 10 
                  ? "Heavy snow expected. Prepare for deep conditions!" 
                  : weather.snowfall > 0 
                    ? "Fresh dusting expected overnight." 
                    : "No fresh snow expected tonight."}
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
              <Snowflake className="w-48 h-48" />
            </div>
          </Card>
        </motion.div>

        {/* Wind & Freezing Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="col-span-1"
        >
          <Card className="bg-white/5 border-white/10 h-full">
            <div className="p-6 flex flex-col justify-center h-full">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/10">
                  <Wind className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Wind</div>
                  <div className="font-display font-bold text-3xl">{weather.windSpeed} <span className="text-lg font-normal text-muted-foreground">mph</span></div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Conditions Summary Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-secondary/50 border-white/5">
          <div className="p-6 flex flex-col md:flex-row gap-8 md:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <img 
                  src={weather.icon} 
                  alt={weather.description} 
                  className="w-8 h-8 opacity-80"
                  onError={(e) => {
                    // Fallback to lucide icon if image fails
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('bg-primary/20');
                  }}
                />
                <CloudSnow className="w-6 h-6 text-primary hidden" /> 
              </div>
              <div>
                <h4 className="font-medium text-lg">Overall Conditions</h4>
                <p className="text-muted-foreground">{weather.description}</p>
              </div>
            </div>
            
            <div className="flex gap-8 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
               <div className="flex flex-col gap-1">
                 <span className="text-xs text-muted-foreground uppercase">Snow Quality</span>
                 <span className="font-medium flex items-center gap-2">
                   {getSnowQuality(weather.temperature, weather.snowfall)}
                 </span>
               </div>
               <div className="flex flex-col gap-1">
                 <span className="text-xs text-muted-foreground uppercase">Visibility</span>
                 <span className="font-medium">
                   {weather.snowfall > 5 ? "Low (Snowing)" : "Good"}
                 </span>
               </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function getSnowQuality(temp: number, snow: number): string {
  if (snow === 0) return "Firm / Groomed";
  if (temp > 32) return "Wet / Slush";
  if (temp < 14 && snow > 2) return "Champagne Powder";
  if (temp < 32 && snow > 0) return "Fresh Powder";
  return "Variable";
}
