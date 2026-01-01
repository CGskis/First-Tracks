
import { pgTable, text, serial, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const resorts = pgTable("resorts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  country: text("country"),
});

export const insertResortSchema = createInsertSchema(resorts).omit({ id: true });

export type Resort = typeof resorts.$inferSelect;
export type InsertResort = z.infer<typeof insertResortSchema>;

// Weather Types (Non-database)
export const weatherSchema = z.object({
  temperature: z.number(),
  snowfall: z.number(), // in cm
  rain: z.number(), // in mm
  windSpeed: z.number(), // in km/h
  freezingLevel: z.number(), // in meters
  description: z.string(),
  isNight: z.boolean(),
  icon: z.string(),
});

export type WeatherForecast = z.infer<typeof weatherSchema>;
