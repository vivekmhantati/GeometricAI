// Utility functions for commodity data processing and formatting

export interface CommodityPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  unit: string;
  category: string;
}

export interface PredictionResult {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  horizon: string;
  chartData: any;
}

export const formatPrice = (price: number, currency: string = "USD"): string => {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    INR: "₹",
    GBP: "£"
  };

  const symbol = symbols[currency] || currency;
  
  if (price >= 1000000) {
    return `${symbol}${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `${symbol}${(price / 1000).toFixed(1)}K`;
  } else {
    return `${symbol}${price.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  }
};

export const formatPercentChange = (change: number): string => {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
};

export const getCommodityIcon = (symbol: string): string => {
  const icons: Record<string, string> = {
    GOLD: "🪙",
    SILVER: "🥈",
    OIL: "🛢️",
    COPPER: "🔶",
    PLATINUM: "⚪",
    PALLADIUM: "⚫"
  };
  
  return icons[symbol] || "📊";
};

export const getCommodityColor = (symbol: string): string => {
  const colors: Record<string, string> = {
    GOLD: "#f59e0b",
    SILVER: "#6b7280",
    OIL: "#3b82f6",
    COPPER: "#f97316",
    PLATINUM: "#9ca3af",
    PALLADIUM: "#8b5cf6"
  };
  
  return colors[symbol] || "#6b7280";
};

export const generateMockPriceHistory = (
  basePrice: number,
  days: number,
  volatility: number = 0.02
): Array<{ date: string; price: number }> => {
  const history = [];
  let currentPrice = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some realistic price movement
    const change = (Math.random() - 0.5) * volatility * currentPrice;
    currentPrice += change;
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Number(currentPrice.toFixed(2))
    });
  }
  
  return history;
};

export const calculateTechnicalIndicators = (prices: number[]) => {
  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, 50);
  const rsi = calculateRSI(prices, 14);
  
  return {
    sma20: sma20[sma20.length - 1],
    sma50: sma50[sma50.length - 1],
    rsi: rsi[rsi.length - 1],
    trend: sma20[sma20.length - 1] > sma50[sma50.length - 1] ? 'bullish' : 'bearish'
  };
};

function calculateSMA(prices: number[], period: number): number[] {
  const sma = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
}

function calculateRSI(prices: number[], period: number): number[] {
  const rsi = [];
  const gains = [];
  const losses = [];
  
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }
  
  for (let i = period - 1; i < gains.length; i++) {
    const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    
    const rs = avgGain / avgLoss;
    const rsiValue = 100 - (100 / (1 + rs));
    rsi.push(rsiValue);
  }
  
  return rsi;
}
