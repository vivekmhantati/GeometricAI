import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { mlService } from "./ml-service";
import { insertChatMessageSchema, insertPredictionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all commodities
  app.get("/api/commodities", async (req, res) => {
    try {
      const commodities = await storage.getCommodities();
      res.json(commodities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch commodities" });
    }
  });

  // Get commodity by symbol
  app.get("/api/commodities/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const commodity = await storage.getCommodityBySymbol(symbol.toUpperCase());
      
      if (!commodity) {
        return res.status(404).json({ error: "Commodity not found" });
      }
      
      res.json(commodity);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch commodity" });
    }
  });

  // Get predictions for a commodity
  app.get("/api/predictions/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const { currency = "USD", horizon = "1M" } = req.query;
      
      const commodity = await storage.getCommodityBySymbol(symbol.toUpperCase());
      if (!commodity) {
        return res.status(404).json({ error: "Commodity not found" });
      }
      
      // Generate new prediction using ML service
      const prediction = await mlService.predictCommodityPrice(
        commodity.symbol,
        commodity.currentPrice,
        horizon as "1M" | "6M" | "1Y",
        currency as string
      );
      
      // Store the prediction
      await storage.createPrediction({
        commodityId: commodity.id,
        horizon: horizon as string,
        predictedPrice: prediction.predictedPrice,
        confidence: prediction.confidence,
        currency: currency as string,
        data: prediction.chartData,
      });
      
      res.json({
        commodity: commodity.name,
        symbol: commodity.symbol,
        currentPrice: commodity.currentPrice,
        ...prediction,
      });
    } catch (error) {
      console.error("Prediction error:", error);
      res.status(500).json({ error: "Failed to generate prediction" });
    }
  });

  // Get latest predictions for all commodities
  app.get("/api/predictions", async (req, res) => {
    try {
      const { currency = "USD" } = req.query;
      const predictions = await storage.getLatestPredictions(currency as string);
      
      // Enrich with commodity data
      const enrichedPredictions = await Promise.all(
        predictions.map(async (prediction) => {
          const commodities = await storage.getCommodities();
          const commodity = commodities.find(c => c.id === prediction.commodityId);
          return {
            ...prediction,
            commodity,
          };
        })
      );
      
      res.json(enrichedPredictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch predictions" });
    }
  });

  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, currency = "USD" } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }
      
      // Process the query using ML service
      const queryAnalysis = await mlService.processQuery(message);
      
      let response = "";
      let chartData = null;
      let commoditySymbol = null;
      
      if (queryAnalysis.commodity) {
        commoditySymbol = queryAnalysis.commodity;
        const commodity = await storage.getCommodityBySymbol(queryAnalysis.commodity);
        
        if (commodity) {
          const horizon = queryAnalysis.timeHorizon || "1M";
          const prediction = await mlService.predictCommodityPrice(
            commodity.symbol,
            commodity.currentPrice,
            horizon,
            currency
          );
          
          // Store prediction
          await storage.createPrediction({
            commodityId: commodity.id,
            horizon,
            predictedPrice: prediction.predictedPrice,
            confidence: prediction.confidence,
            currency,
            data: prediction.chartData,
          });
          
          const changeDirection = prediction.predictedPrice > commodity.currentPrice ? "increase" : "decrease";
          const changePercent = Math.abs((prediction.predictedPrice - commodity.currentPrice) / commodity.currentPrice * 100).toFixed(1);
          
          response = `Based on my analysis, ${commodity.name} (${commodity.symbol}) is predicted to ${changeDirection} by ${changePercent}% over the next ${horizon.toLowerCase()}. Current price: ${currency} ${commodity.currentPrice.toFixed(2)}, Predicted price: ${currency} ${prediction.predictedPrice.toFixed(2)}. Confidence level: ${(prediction.confidence * 100).toFixed(1)}%.`;
          
          chartData = prediction.chartData;
        } else {
          response = `I couldn't find information about ${queryAnalysis.commodity}. Available commodities include Gold, Oil, Silver, Copper, Platinum, and Palladium.`;
        }
      } else {
        // General responses
        const generalResponses = [
          "I analyze commodity markets using advanced machine learning models. Ask me about specific commodities like gold, oil, silver, or copper for detailed predictions.",
          "I can provide price forecasts for major commodities over different time horizons (1 month, 6 months, 1 year). What commodity interests you?",
          "My predictions are based on historical price patterns, market sentiment, and economic indicators. Which commodity would you like to analyze?",
          "I track real-time data for precious metals, energy commodities, and industrial metals. What specific prediction do you need?",
        ];
        response = generalResponses[Math.floor(Math.random() * generalResponses.length)];
      }
      
      // Store chat message
      await storage.createChatMessage({
        message,
        response,
        commoditySymbol,
        currency,
      });
      
      res.json({
        response,
        chartData,
        commoditySymbol,
        queryAnalysis,
      });
      
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Get chat history
  app.get("/api/chat/history", async (req, res) => {
    try {
      const { limit = 20 } = req.query;
      const history = await storage.getChatHistory(Number(limit));
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  // Get exchange rates
  app.get("/api/exchange-rates", async (req, res) => {
    try {
      const { from = "USD", to } = req.query;
      
      if (!to) {
        return res.status(400).json({ error: "Target currency is required" });
      }
      
      const rate = await storage.getExchangeRate(from as string, to as string);
      
      if (!rate) {
        return res.status(404).json({ error: "Exchange rate not found" });
      }
      
      res.json(rate);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exchange rate" });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Valid email is required" });
      }
      
      // In a real application, you would integrate with an email service
      // For now, we'll just return success
      res.json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      res.status(500).json({ error: "Failed to subscribe to newsletter" });
    }
  });

  // Contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
      // In a real application, you would send an email or store the message
      // For now, we'll just return success
      res.json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
