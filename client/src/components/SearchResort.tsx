import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useResortSearch, type Resort } from "@/hooks/use-weather";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";

interface SearchResortProps {
  onSelect: (resort: Resort) => void;
}

export function SearchResort({ onSelect }: SearchResortProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const { data: results, isLoading } = useResortSearch(query);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (resort: Resort) => {
    onSelect(resort);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto z-50">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for a ski resort (e.g. Whistler, Chamonix)..."
          className="pl-12 h-14 text-lg border-white/10 bg-black/20 focus:bg-black/40 backdrop-blur-xl rounded-2xl"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (results?.length || 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute w-full mt-2 py-2 bg-card/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {results?.map((resort) => (
              <button
                key={resort.id}
                onClick={() => handleSelect(resort)}
                className="w-full px-6 py-3 flex items-center gap-3 hover:bg-white/5 text-left transition-colors group"
              >
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{resort.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {[resort.region, resort.country].filter(Boolean).join(", ")}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
