import { 
  users, commodities, predictions, chatMessages, exchangeRates,
  type User, type InsertUser,
  type Commodity, type InsertCommodity,
  type Prediction, type InsertPrediction,
  type ChatMessage, type InsertChatMessage,
  type ExchangeRate, type InsertExchangeRate
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Commodities
  getCommodities(): Promise<Commodity[]>;
  getCommodityBySymbol(symbol: string): Promise<Commodity | undefined>;
  createCommodity(commodity: InsertCommodity): Promise<Commodity>;
  updateCommodityPrice(symbol: string, price: number): Promise<void>;

  // Predictions
  getPredictionsByCommodity(commodityId: number, currency?: string): Promise<Prediction[]>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  getLatestPredictions(currency?: string): Promise<Prediction[]>;

  // Chat Messages
  getChatHistory(limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Exchange Rates
  getExchangeRate(baseCurrency: string, targetCurrency: string): Promise<ExchangeRate | undefined>;
  createExchangeRate(rate: InsertExchangeRate): Promise<ExchangeRate>;
  updateExchangeRate(baseCurrency: string, targetCurrency: string, rate: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCommodities(): Promise<Commodity[]> {
    return await db.select().from(commodities);
  }

  async getCommodityBySymbol(symbol: string): Promise<Commodity | undefined> {
    const [commodity] = await db.select().from(commodities).where(eq(commodities.symbol, symbol));
    return commodity || undefined;
  }

  async createCommodity(insertCommodity: InsertCommodity): Promise<Commodity> {
    const [commodity] = await db
      .insert(commodities)
      .values(insertCommodity)
      .returning();
    return commodity;
  }

  async updateCommodityPrice(symbol: string, price: number): Promise<void> {
    await db
      .update(commodities)
      .set({ currentPrice: price, lastUpdated: new Date() })
      .where(eq(commodities.symbol, symbol));
  }

  async getPredictionsByCommodity(commodityId: number, currency = "USD"): Promise<Prediction[]> {
    return await db
      .select()
      .from(predictions)
      .where(and(eq(predictions.commodityId, commodityId), eq(predictions.currency, currency)));
  }

  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const [prediction] = await db
      .insert(predictions)
      .values(insertPrediction)
      .returning();
    return prediction;
  }

  async getLatestPredictions(currency = "USD"): Promise<Prediction[]> {
    return await db
      .select()
      .from(predictions)
      .where(eq(predictions.currency, currency));
  }

  async getChatHistory(limit = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getExchangeRate(baseCurrency: string, targetCurrency: string): Promise<ExchangeRate | undefined> {
    const [rate] = await db
      .select()
      .from(exchangeRates)
      .where(and(eq(exchangeRates.baseCurrency, baseCurrency), eq(exchangeRates.targetCurrency, targetCurrency)));
    return rate || undefined;
  }

  async createExchangeRate(insertRate: InsertExchangeRate): Promise<ExchangeRate> {
    const [rate] = await db
      .insert(exchangeRates)
      .values(insertRate)
      .returning();
    return rate;
  }

  async updateExchangeRate(baseCurrency: string, targetCurrency: string, rate: number): Promise<void> {
    await db
      .update(exchangeRates)
      .set({ rate, lastUpdated: new Date() })
      .where(and(eq(exchangeRates.baseCurrency, baseCurrency), eq(exchangeRates.targetCurrency, targetCurrency)));
  }
}

export const storage = new DatabaseStorage();
