
import { db } from "./db";
import { resorts, type InsertResort, type Resort } from "@shared/schema";
import { ilike } from "drizzle-orm";

export interface IStorage {
  // Resort caching (optional, but good for structure)
  createResort(resort: InsertResort): Promise<Resort>;
  searchResortsByName(name: string): Promise<Resort[]>;
}

export class DatabaseStorage implements IStorage {
  async createResort(insertResort: InsertResort): Promise<Resort> {
    const [resort] = await db.insert(resorts).values(insertResort).returning();
    return resort;
  }

  async searchResortsByName(name: string): Promise<Resort[]> {
    return await db.select().from(resorts).where(ilike(resorts.name, `%${name}%`));
  }
}

export const storage = new DatabaseStorage();
