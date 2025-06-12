import { db } from "./db";
import { commodities, exchangeRates } from "@shared/schema";

export async function initializeDatabase() {
  console.log("Initializing database with sample data...");
  
  try {
    // Check if commodities already exist
    const existingCommodities = await db.select().from(commodities);
    
    if (existingCommodities.length === 0) {
      // Insert sample commodities
      const sampleCommodities = [
        { symbol: "GOLD", name: "Gold", category: "Precious Metals", unit: "USD/oz", currentPrice: 1847.52, currency: "USD" },
        { symbol: "OIL", name: "Crude Oil", category: "Energy", unit: "USD/bbl", currentPrice: 82.15, currency: "USD" },
        { symbol: "SILVER", name: "Silver", category: "Precious Metals", unit: "USD/oz", currentPrice: 21.84, currency: "USD" },
        { symbol: "COPPER", name: "Copper", category: "Industrial Metals", unit: "USD/MT", currentPrice: 8247, currency: "USD" },
        { symbol: "PLATINUM", name: "Platinum", category: "Precious Metals", unit: "USD/oz", currentPrice: 967.32, currency: "USD" },
        { symbol: "PALLADIUM", name: "Palladium", category: "Precious Metals", unit: "USD/oz", currentPrice: 1342.18, currency: "USD" },
      ];

      await db.insert(commodities).values(sampleCommodities);
      console.log("✓ Sample commodities inserted");
    } else {
      console.log("✓ Commodities already exist, skipping insert");
    }

    // Check if exchange rates already exist
    const existingRates = await db.select().from(exchangeRates);
    
    if (existingRates.length === 0) {
      // Insert sample exchange rates
      const sampleRates = [
        { baseCurrency: "USD", targetCurrency: "EUR", rate: 0.85 },
        { baseCurrency: "USD", targetCurrency: "INR", rate: 83.12 },
        { baseCurrency: "USD", targetCurrency: "GBP", rate: 0.79 },
        { baseCurrency: "EUR", targetCurrency: "USD", rate: 1.18 },
        { baseCurrency: "INR", targetCurrency: "USD", rate: 0.012 },
        { baseCurrency: "GBP", targetCurrency: "USD", rate: 1.27 },
      ];

      await db.insert(exchangeRates).values(sampleRates);
      console.log("✓ Sample exchange rates inserted");
    } else {
      console.log("✓ Exchange rates already exist, skipping insert");
    }

    console.log("Database initialization completed successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}