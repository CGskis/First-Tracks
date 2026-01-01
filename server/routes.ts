
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Search Resorts (Proxy to Open-Meteo Geocoding)
  app.get(api.resorts.search.path, async (req, res) => {
    try {
      const { q } = api.resorts.search.input.parse(req.query);
      
      // Call Open-Meteo Geocoding API
      // Added search for both name and potentially Maine if not present to help find Sunday River
      let searchQuery = q;
      if (q.toLowerCase().includes("sunday river") && !q.toLowerCase().includes("maine")) {
        searchQuery = `${q} Maine`;
      } else if (q.toLowerCase().includes("newry") && !q.toLowerCase().includes("maine")) {
        searchQuery = `${q} Maine`;
      }

      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=20&language=en&format=json`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch from Geocoding API");
      }

      const data = await response.json();
      
      if (!data.results) {
        return res.json([]);
      }

      // Map to our Resort schema structure
      const results = data.results.map((r: any) => ({
        id: r.id, // Using external ID for now, frontend handles it
        name: r.name,
        latitude: r.latitude,
        longitude: r.longitude,
        country: r.country,
      }));

      res.json(results);
    } catch (err) {
      console.error("Geocoding error:", err);
      res.status(500).json({ message: "Failed to search resorts" });
    }
  });

  // Get Weather (Proxy to Open-Meteo Forecast)
  app.get(api.weather.get.path, async (req, res) => {
    try {
      const { lat, lon } = api.weather.get.input.parse(req.query);

      // Call Open-Meteo Forecast API
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,snowfall,rain,weather_code,wind_speed_10m,freezing_level_height&timezone=auto`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();
      
      // Find the "Tonight" forecast
      // We look for the next 8 PM (20:00) to 6 AM window.
      // For simplicity, let's just grab the forecast for roughly "tonight" relative to the location's time.
      // Open-Meteo returns time in ISO format. We can just pick the next 8PM or if it's currently night, use current hour.
      
      // Simple logic: Find the next occurrence of 22:00 (10 PM) in the hourly data to represent "Night"
      // or average the night hours. Let's pick a representative hour, say 22:00 today or tomorrow.
      
      const hourly = data.hourly;
      const now = new Date();
      
      // Find the index for the next 22:00
      let targetIndex = -1;
      
      for (let i = 0; i < hourly.time.length; i++) {
        const time = new Date(hourly.time[i]);
        if (time > now && time.getHours() === 22) {
          targetIndex = i;
          break;
        }
      }

      // If we can't find 10 PM (maybe it's past), just take 6 hours from now
      if (targetIndex === -1) {
        targetIndex = 0; // Fallback to current
      }

      const weatherCode = hourly.weather_code[targetIndex];
      let description = "Clear";
      let icon = "moon"; // default
      
      // WMO Weather interpretation codes (http://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM)
      // 0: Clear sky
      // 1, 2, 3: Mainly clear, partly cloudy, and overcast
      // 45, 48: Fog
      // 51-57: Drizzle
      // 61-65: Rain
      // 71-77: Snow
      // 80-82: Rain showers
      // 85-86: Snow showers
      // 95-99: Thunderstorm
      
      if (weatherCode >= 71 && weatherCode <= 77) {
        description = "Snow";
        icon = "snow";
      } else if (weatherCode >= 85 && weatherCode <= 86) {
        description = "Snow Showers";
        icon = "snow";
      } else if (weatherCode >= 61 && weatherCode <= 65) {
        description = "Rain";
        icon = "rain";
      } else if (weatherCode >= 51 && weatherCode <= 57) {
        description = "Drizzle";
        icon = "cloud-drizzle";
      } else if (weatherCode >= 1 && weatherCode <= 3) {
        description = "Cloudy";
        icon = "cloud";
      }

      const forecast = {
        temperature: hourly.temperature_2m[targetIndex],
        snowfall: hourly.snowfall[targetIndex], // cm
        rain: hourly.rain[targetIndex], // mm
        windSpeed: hourly.wind_speed_10m[targetIndex], // km/h
        freezingLevel: hourly.freezing_level_height[targetIndex], // meters
        description,
        isNight: true,
        icon,
      };

      res.json(forecast);
    } catch (err) {
      console.error("Weather fetch error:", err);
      res.status(500).json({ message: "Failed to fetch weather" });
    }
  });

  return httpServer;
}
