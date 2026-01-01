import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// Types derived from schema
export type Resort = z.infer<typeof api.resorts.search.responses[200]>[number];
export type WeatherData = z.infer<typeof api.weather.get.responses[200]>;

export function useResortSearch(query: string) {
  return useQuery({
    queryKey: [api.resorts.search.path, query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      
      const url = buildUrl(api.resorts.search.path);
      const res = await fetch(`${url}?q=${encodeURIComponent(query)}`, { 
        credentials: "include" 
      });
      
      if (!res.ok) throw new Error("Failed to search resorts");
      return api.resorts.search.responses[200].parse(await res.json());
    },
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useWeather(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: [api.weather.get.path, lat, lon],
    queryFn: async () => {
      if (lat === null || lon === null) throw new Error("Location required");
      
      const url = buildUrl(api.weather.get.path);
      const res = await fetch(`${url}?lat=${lat}&lon=${lon}`, { 
        credentials: "include" 
      });
      
      if (!res.ok) throw new Error("Failed to fetch weather");
      return api.weather.get.responses[200].parse(await res.json());
    },
    enabled: lat !== null && lon !== null,
    refetchInterval: 1000 * 60 * 15, // 15 minutes
  });
}
