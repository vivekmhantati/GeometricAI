interface PredictionData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    borderWidth: number;
  }>;
}

interface MarketFactors {
  inflation: number;
  usdIndex: number;
  volatility: number;
  demand: number;
  supply: number;
}

export class MLService {
  private marketFactors: MarketFactors = {
    inflation: 0.032, // 3.2%
    usdIndex: 103.5,
    volatility: 0.15,
    demand: 1.0,
    supply: 1.0
  };

  // Simulate LSTM-based prediction with realistic price movements
  async predictCommodityPrice(
    symbol: string, 
    currentPrice: number, 
    horizon: "1M" | "6M" | "1Y",
    currency: string = "USD"
  ): Promise<{ predictedPrice: number; confidence: number; chartData: PredictionData }> {
    
    const days = this.getHorizonDays(horizon);
    const { predictedPrice, confidence } = this.generatePrediction(symbol, currentPrice, days);
    const chartData = this.generateChartData(symbol, currentPrice, predictedPrice, days);
    
    return { predictedPrice, confidence, chartData };
  }

  private getHorizonDays(horizon: "1M" | "6M" | "1Y"): number {
    switch (horizon) {
      case "1M": return 30;
      case "6M": return 180;
      case "1Y": return 365;
      default: return 30;
    }
  }

  private generatePrediction(symbol: string, currentPrice: number, days: number): { predictedPrice: number; confidence: number } {
    // Commodity-specific factors
    const commodityFactors = this.getCommodityFactors(symbol);
    
    // Base trend calculation
    const baseTrend = commodityFactors.trend * (days / 365);
    const volatilityFactor = commodityFactors.volatility * Math.sqrt(days / 365);
    
    // Market sentiment influence
    const sentimentImpact = this.calculateSentimentImpact(symbol);
    
    // Seasonal adjustments
    const seasonalAdjustment = this.getSeasonalAdjustment(symbol, days);
    
    // Combined prediction
    const totalChange = baseTrend + sentimentImpact + seasonalAdjustment;
    const predictedPrice = currentPrice * (1 + totalChange);
    
    // Confidence calculation (higher for shorter horizons)
    const baseConfidence = commodityFactors.baseConfidence;
    const timeDecay = Math.exp(-days / 200); // Confidence decreases with time
    const confidence = Math.min(0.98, baseConfidence * timeDecay);
    
    return { predictedPrice, confidence };
  }

  private getCommodityFactors(symbol: string) {
    const factors = {
      "GOLD": { trend: 0.08, volatility: 0.12, baseConfidence: 0.94 },
      "OIL": { trend: 0.06, volatility: 0.25, baseConfidence: 0.89 },
      "SILVER": { trend: 0.12, volatility: 0.18, baseConfidence: 0.91 },
      "COPPER": { trend: 0.05, volatility: 0.15, baseConfidence: 0.92 },
      "PLATINUM": { trend: 0.04, volatility: 0.16, baseConfidence: 0.90 },
      "PALLADIUM": { trend: 0.10, volatility: 0.22, baseConfidence: 0.88 }
    };
    
    return factors[symbol as keyof typeof factors] || factors.GOLD;
  }

  private calculateSentimentImpact(symbol: string): number {
    // Simulate market sentiment analysis
    const sentimentScores = {
      "GOLD": 0.15,   // Positive due to inflation hedge
      "OIL": -0.05,   // Negative due to renewable energy transition
      "SILVER": 0.10, // Positive due to industrial demand
      "COPPER": 0.08, // Positive due to EV demand
      "PLATINUM": 0.02,
      "PALLADIUM": -0.02
    };
    
    return sentimentScores[symbol as keyof typeof sentimentScores] || 0;
  }

  private getSeasonalAdjustment(symbol: string, days: number): number {
    const month = new Date().getMonth();
    const seasonalFactors = {
      "GOLD": [0.01, 0.02, -0.01, 0.01, -0.02, 0.01, 0.03, 0.01, -0.01, 0.02, 0.01, 0.02],
      "OIL": [0.02, 0.01, -0.01, -0.02, 0.03, 0.02, 0.01, -0.01, 0.01, 0.02, 0.01, 0.01],
      "SILVER": [0.01, 0.01, 0.00, 0.01, -0.01, 0.01, 0.02, 0.01, 0.00, 0.01, 0.01, 0.01]
    };
    
    const factors = seasonalFactors[symbol as keyof typeof seasonalFactors] || seasonalFactors.GOLD;
    return factors[month] * (days / 365);
  }

  private generateChartData(symbol: string, currentPrice: number, finalPrice: number, days: number): PredictionData {
    const labels: string[] = [];
    const historicalData: number[] = [];
    const predictedData: number[] = [];
    
    const totalPoints = Math.min(days, 50); // Limit chart points for performance
    const stepSize = Math.max(1, Math.floor(days / totalPoints));
    
    // Generate historical data (last 30 days)
    const historicalDays = 30;
    for (let i = -historicalDays; i <= 0; i += stepSize) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      labels.push(date.toLocaleDateString());
      
      // Generate realistic historical price with some volatility
      const volatility = 0.02;
      const randomChange = (Math.random() - 0.5) * volatility;
      const historicalPrice = currentPrice * (1 + randomChange * Math.abs(i) / historicalDays);
      historicalData.push(Number(historicalPrice.toFixed(2)));
      predictedData.push(i === 0 ? Number(currentPrice.toFixed(2)) : NaN);
    }
    
    // Generate prediction data
    const priceChange = (finalPrice - currentPrice) / days;
    for (let i = 1; i <= days; i += stepSize) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      labels.push(date.toLocaleDateString());
      
      // Add some realistic volatility to the prediction
      const basePrice = currentPrice + (priceChange * i);
      const volatility = 0.015 * Math.sqrt(i / days);
      const randomFactor = (Math.random() - 0.5) * volatility;
      const predictedPrice = basePrice * (1 + randomFactor);
      
      historicalData.push(NaN);
      predictedData.push(Number(predictedPrice.toFixed(2)));
    }
    
    const colors = this.getChartColors(symbol);
    
    return {
      labels,
      datasets: [
        {
          label: `${symbol} Historical`,
          data: historicalData,
          borderColor: colors.historical,
          backgroundColor: colors.historicalBg,
          tension: 0.4,
          borderWidth: 2
        },
        {
          label: `${symbol} Prediction`,
          data: predictedData,
          borderColor: colors.prediction,
          backgroundColor: colors.predictionBg,
          tension: 0.4,
          borderWidth: 2
        }
      ]
    };
  }

  private getChartColors(symbol: string) {
    const colorMap = {
      "GOLD": {
        historical: '#f59e0b',
        historicalBg: 'rgba(245, 158, 11, 0.1)',
        prediction: '#fbbf24',
        predictionBg: 'rgba(251, 191, 36, 0.1)'
      },
      "OIL": {
        historical: '#3b82f6',
        historicalBg: 'rgba(59, 130, 246, 0.1)',
        prediction: '#60a5fa',
        predictionBg: 'rgba(96, 165, 250, 0.1)'
      },
      "SILVER": {
        historical: '#6b7280',
        historicalBg: 'rgba(107, 114, 128, 0.1)',
        prediction: '#9ca3af',
        predictionBg: 'rgba(156, 163, 175, 0.1)'
      },
      "COPPER": {
        historical: '#f97316',
        historicalBg: 'rgba(249, 115, 22, 0.1)',
        prediction: '#fb923c',
        predictionBg: 'rgba(251, 146, 60, 0.1)'
      }
    };
    
    return colorMap[symbol as keyof typeof colorMap] || colorMap.GOLD;
  }

  // Process natural language queries
  async processQuery(query: string): Promise<{
    commodity?: string;
    timeHorizon?: "1M" | "6M" | "1Y";
    currency?: string;
    intent: string;
  }> {
    const lowerQuery = query.toLowerCase();
    
    // Extract commodity
    let commodity: string | undefined;
    const commodityKeywords = {
      gold: ['gold', 'au', 'bullion'],
      oil: ['oil', 'crude', 'petroleum', 'wti', 'brent'],
      silver: ['silver', 'ag'],
      copper: ['copper', 'cu'],
      platinum: ['platinum', 'pt'],
      palladium: ['palladium', 'pd']
    };
    
    for (const [symbol, keywords] of Object.entries(commodityKeywords)) {
      if (keywords.some(keyword => lowerQuery.includes(keyword))) {
        commodity = symbol.toUpperCase();
        break;
      }
    }
    
    // Extract time horizon
    let timeHorizon: "1M" | "6M" | "1Y" | undefined;
    if (lowerQuery.includes('month') || lowerQuery.includes('1m')) {
      timeHorizon = '1M';
    } else if (lowerQuery.includes('6 month') || lowerQuery.includes('6m')) {
      timeHorizon = '6M';
    } else if (lowerQuery.includes('year') || lowerQuery.includes('1y')) {
      timeHorizon = '1Y';
    }
    
    // Extract currency
    let currency: string | undefined;
    const currencyKeywords = ['usd', 'eur', 'inr', 'gbp'];
    for (const curr of currencyKeywords) {
      if (lowerQuery.includes(curr)) {
        currency = curr.toUpperCase();
        break;
      }
    }
    
    // Determine intent
    let intent = 'general';
    if (lowerQuery.includes('predict') || lowerQuery.includes('forecast')) {
      intent = 'prediction';
    } else if (lowerQuery.includes('price') || lowerQuery.includes('cost')) {
      intent = 'price_inquiry';
    } else if (lowerQuery.includes('chart') || lowerQuery.includes('graph')) {
      intent = 'chart_request';
    }
    
    return { commodity, timeHorizon, currency, intent };
  }

  // Convert prices between currencies
  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string, exchangeRates: Map<string, number>): Promise<number> {
    if (fromCurrency === toCurrency) return amount;
    
    const key = `${fromCurrency}_${toCurrency}`;
    const rate = exchangeRates.get(key);
    
    if (rate) {
      return amount * rate;
    }
    
    // Try reverse conversion
    const reverseKey = `${toCurrency}_${fromCurrency}`;
    const reverseRate = exchangeRates.get(reverseKey);
    if (reverseRate) {
      return amount / reverseRate;
    }
    
    // Default fallback
    return amount;
  }
}

export const mlService = new MLService();
