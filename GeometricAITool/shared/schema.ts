import { pgTable, text, serial, integer, real, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const commodities = pgTable("commodities", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  unit: text("unit").notNull(),
  currentPrice: real("current_price").notNull(),
  currency: text("currency").notNull().default("USD"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id").notNull(),
  horizon: text("horizon").notNull(), // "1M", "6M", "1Y"
  predictedPrice: real("predicted_price").notNull(),
  confidence: real("confidence").notNull(),
  currency: text("currency").notNull().default("USD"),
  createdAt: timestamp("created_at").defaultNow(),
  data: json("data"), // Chart.js compatible data
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  commoditySymbol: text("commodity_symbol"),
  currency: text("currency").default("USD"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exchangeRates = pgTable("exchange_rates", {
  id: serial("id").primaryKey(),
  baseCurrency: text("base_currency").notNull(),
  targetCurrency: text("target_currency").notNull(),
  rate: real("rate").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertCommoditySchema = createInsertSchema(commodities).omit({
  id: true,
  lastUpdated: true,
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertExchangeRateSchema = createInsertSchema(exchangeRates).omit({
  id: true,
  lastUpdated: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Commodity = typeof commodities.$inferSelect;
export type InsertCommodity = z.infer<typeof insertCommoditySchema>;
export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ExchangeRate = typeof exchangeRates.$inferSelect;
export type InsertExchangeRate = z.infer<typeof insertExchangeRateSchema>;
