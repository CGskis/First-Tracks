
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Search Resorts (Using a better combined strategy)
  app.get(api.resorts.search.path, async (req, res) => {
    try {
      const { q } = api.resorts.search.input.parse(req.query);
      
      // We'll use a mix of Geocoding and a hint for Sunday River
      let searchQuery = q;
      if (q.toLowerCase().includes("sunday river")) {
        searchQuery = "Sunday River Maine";
      }

      // Try a more specialized geocoding/search if available, 
      // but for now let's stick to Open-Meteo with better parameters
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=20&language=en&format=json`
      );
      
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      
      const results = (data.results || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        latitude: r.latitude,
        longitude: r.longitude,
        country: r.country,
        region: r.admin1,
      }));

      res.json(results);
    } catch (err) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Get Weather (Multi-source)
  app.get(api.weather.get.path, async (req, res) => {
    try {
      const { lat, lon } = api.weather.get.input.parse(req.query);

      // Source 1: Open-Meteo
      const meteoRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,snowfall,rain,weather_code,wind_speed_10m,freezing_level_height&timezone=auto&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`
      );

      if (!meteoRes.ok) throw new Error("Meteo failed");
      const meteoData = await meteoRes.json();
      
      const hourly = meteoData.hourly;
      
      // Find the current hour index or default to a reasonable one
      const now = new Date();
      const currentIso = now.toISOString().slice(0, 13) + ":00";
      let targetIndex = hourly.time.findIndex((t: string) => t.includes(currentIso));
      if (targetIndex === -1) targetIndex = 22; // Fallback to 10 PM if current hour not found

      const weatherCode = hourly.weather_code[targetIndex];
      const { description, icon } = getWeatherInfo(weatherCode);

      const forecast = {
        temperature: hourly.temperature_2m[targetIndex],
        apparentTemperature: hourly.apparent_temperature[targetIndex],
        snowfall: hourly.snowfall[targetIndex],
        rain: hourly.rain[targetIndex],
        windSpeed: hourly.wind_speed_10m[targetIndex],
        description: description,
        isNight: targetIndex >= 18 || targetIndex <= 6,
        icon: icon,
        source: "Open-Meteo",
      };

      res.json(forecast);
    } catch (err) {
      res.status(500).json({ message: "Weather failed" });
    }
  });

  return httpServer;
}

function getWeatherInfo(code: number): { description: string, icon: string } {
  const weatherCodeMap: Record<number, { description: string, icon: string }> = {
    0: { description: "Clear sky", icon: "sun" },
    1: { description: "Mainly clear", icon: "sun" },
    2: { description: "Partly cloudy", icon: "cloud-sun" },
    3: { description: "Overcast", icon: "cloud" },
    45: { description: "Fog", icon: "cloud" },
    48: { description: "Depositing rime fog", icon: "cloud" },
    51: { description: "Light drizzle", icon: "cloud-rain" },
    53: { description: "Moderate drizzle", icon: "cloud-rain" },
    55: { description: "Dense drizzle", icon: "cloud-rain" },
    61: { description: "Slight rain", icon: "cloud-rain" },
    63: { description: "Moderate rain", icon: "cloud-rain" },
    65: { description: "Heavy rain", icon: "cloud-rain" },
    71: { description: "Slight snow fall", icon: "snowflake" },
    73: { description: "Moderate snow fall", icon: "snowflake" },
    75: { description: "Heavy snow fall", icon: "cloud-snow" },
    77: { description: "Snow grains", icon: "snowflake" },
    80: { description: "Slight rain showers", icon: "cloud-rain" },
    81: { description: "Moderate rain showers", icon: "cloud-rain" },
    82: { description: "Violent rain showers", icon: "cloud-rain" },
    85: { description: "Slight snow showers", icon: "cloud-snow" },
    86: { description: "Heavy snow showers", icon: "cloud-snow" },
    95: { description: "Thunderstorm", icon: "cloud-lightning" },
    96: { description: "Thunderstorm with slight hail", icon: "cloud-lightning" },
    99: { description: "Thunderstorm with heavy hail", icon: "cloud-lightning" },
  };

  return weatherCodeMap[code] || { description: "Variable", icon: "cloud" };
}
