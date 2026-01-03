
import { pgTable, text, serial, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const resorts = pgTable("resorts", {
  id: serial("id").primaryKey(),
  externalId: text("external_id").unique(), // For Ski API / Slopes
  name: text("name").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  country: text("country"),
  region: text("region"),
  state: text("state"), // Added state field explicitly
  slug: text("slug"),
});

export const insertResortSchema = createInsertSchema(resorts).omit({ id: true });

export type Resort = typeof resorts.$inferSelect;
export type InsertResort = z.infer<typeof insertResortSchema>;

// Weather Types (Non-database)
export const weatherSchema = z.object({
  temperature: z.number(),
  apparentTemperature: z.number().optional(),
  snowfall: z.number(), // in cm
  rain: z.number(), // in mm
  windSpeed: z.number(), // in km/h
  description: z.string(),
  isNight: z.boolean(),
  icon: z.string(),
  source: z.string().optional(),
  trails: z.array(z.object({
    name: z.string(),
    status: z.enum(["open", "closed"]),
    difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"])
  })).optional(),
});

export type WeatherForecast = z.infer<typeof weatherSchema>;
