import path from "path";
import fs from "fs";
import { db, schema, useRealDB } from "./db";
import { eq } from "drizzle-orm";

// Paths to static JSON data
const citiesPath = path.resolve(__dirname, "..", "client", "data", "canadaCities.json");
const hotelsPath = path.resolve(__dirname, "..", "client", "data", "canadaHotels.json");

/**
 * Seed cities and hotels tables if they are empty.
 * Called after the real DB connection is established.
 */
export async function seedIfEmpty() {
  if (!useRealDB) {
    console.log('⚠️ Skipping seeding: no real DB connection');
    return;
  }
  try {
    // Load JSON data
    const citiesData: { name: string; province?: string }[] = JSON.parse(fs.readFileSync(citiesPath, "utf-8"));
    const hotelsData: { name: string; city: string; address?: string }[] = JSON.parse(fs.readFileSync(hotelsPath, "utf-8"));

    // Seed cities
    const existingCities = await db.select().from(schema.cities);
    if (existingCities.length === 0) {
      const cityInserts = citiesData.map((c) => ({ name: c.name, province: c.province }));
      await db.insert(schema.cities).values(cityInserts);
      console.log(`✅ Seeded ${cityInserts.length} cities`);
    }

    // Seed hotels (requires city foreign key)
    const existingHotels = await db.select().from(schema.hotels);
    if (existingHotels.length === 0) {
      // Map city name to id
      const cityMap = new Map<string, number>();
      const allCities = await db.select().from(schema.cities);
      allCities.forEach((c) => cityMap.set(c.name, c.id));

      const hotelInserts = hotelsData
        .map((h) => {
          const cityId = cityMap.get(h.city);
          if (!cityId) return null;
          return { name: h.name, cityId, address: h.address };
        })
        .filter((h) => h !== null);

      if (hotelInserts.length > 0) {
        // @ts-ignore - drizzle typing may require explicit type
        await db.insert(schema.hotels).values(hotelInserts as any);
        console.log(`✅ Seeded ${hotelInserts.length} hotels`);
      }
    }
  } catch (e) {
    console.error("Seeding error:", e);
  }
}
