import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Coins, Zap, Award, Factory } from "lucide-react";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Commodity {
  id: number;
  symbol: string;
  name: string;
  currentPrice: number;
  unit: string;
  category: string;
}

interface PredictionData {
  commodity: string;
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  chartData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
      borderWidth: number;
    }>;
  };
}

const commodityIcons = {
  GOLD: Coins,
  OIL: Zap,
  SILVER: Award,
  COPPER: Factory,
  PLATINUM: Award,
  PALLADIUM: Award
};

const commodityColors = {
  GOLD: "text-yellow-500",
  OIL: "text-blue-400",
  SILVER: "text-gray-300",
  COPPER: "text-orange-400",
  PLATINUM: "text-gray-400",
  PALLADIUM: "text-purple-400"
};

export default function Markets() {
  const [selectedHorizon, setSelectedHorizon] = useState<"1M" | "6M" | "1Y">("1M");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [predictions, setPredictions] = useState<Record<string, PredictionData>>({});
  const chartRefs = useRef<Record<string, Chart | null>>({});

  const { data: commodities, isLoading } = useQuery<Commodity[]>({
    queryKey: ['/api/commodities'],
  });

  const fetchPrediction = async (symbol: string) => {
    try {
      const response = await fetch(`/api/predictions/${symbol}?horizon=${selectedHorizon}&currency=${selectedCurrency}`);
      if (!response.ok) throw new Error('Failed to fetch prediction');
      const data = await response.json();
      setPredictions(prev => ({ ...prev, [symbol]: data }));
      return data;
    } catch (error) {
      console.error('Error fetching prediction:', error);
      return null;
    }
  };

  const createChart = (canvasId: string, data: PredictionData) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    // Destroy existing chart
    if (chartRefs.current[canvasId]) {
      chartRefs.current[canvasId]?.destroy();
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    chartRefs.current[canvasId] = new Chart(ctx, {
      type: 'line',
      data: data.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#9ca3af'
            }
          }
        },
        scales: {
          x: {
            ticks: { 
              color: '#9ca3af',
              maxTicksLimit: 8
            },
            grid: { 
              color: 'rgba(255,255,255,0.1)' 
            }
          },
          y: {
            ticks: { 
              color: '#9ca3af',
              callback: function(value: any) {
                return selectedCurrency + ' ' + value.toLocaleString();
              }
            },
            grid: { 
              color: 'rgba(255,255,255,0.1)' 
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  };

  useEffect(() => {
    if (commodities) {
      commodities.forEach(commodity => {
        fetchPrediction(commodity.symbol);
      });
    }
  }, [commodities, selectedHorizon, selectedCurrency]);

  useEffect(() => {
    Object.entries(predictions).forEach(([symbol, data]) => {
      createChart(`${symbol.toLowerCase()}Chart`, data);
    });

    return () => {
      Object.values(chartRefs.current).forEach(chart => {
        chart?.destroy();
      });
      chartRefs.current = {};
    };
  }, [predictions]);

  if (isLoading) {
    return (
      <section id="markets" className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading market data...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="markets" className="py-20 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-5 bg-cover bg-center" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1642790106117-e829e14a795f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
        }}
      />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Live Market <span className="text-primary">Predictions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time AI predictions for major commodities with interactive charts and analysis
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Select value={selectedHorizon} onValueChange={(value: any) => setSelectedHorizon(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="INR">INR (₹)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Market Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {commodities?.slice(0, 4).map((commodity) => {
            const prediction = predictions[commodity.symbol];
            const Icon = commodityIcons[commodity.symbol as keyof typeof commodityIcons] || Coins;
            const colorClass = commodityColors[commodity.symbol as keyof typeof commodityColors] || "text-gray-400";
            const priceChange = prediction ? ((prediction.predictedPrice - prediction.currentPrice) / prediction.currentPrice * 100) : 0;
            const isPositive = priceChange > 0;
            
            return (
              <div key={commodity.id} className="glass-darker rounded-xl p-6 text-center">
                <div className={`${colorClass} text-2xl mb-2`}>
                  <Icon className="w-6 h-6 mx-auto" />
                </div>
                <div className="text-2xl font-bold font-mono">
                  {selectedCurrency} {commodity.currentPrice.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {commodity.name} ({commodity.unit})
                </div>
                {prediction && (
                  <div className={`text-sm flex items-center justify-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(priceChange).toFixed(1)}%
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Interactive Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {commodities?.map((commodity) => {
            const prediction = predictions[commodity.symbol];
            
            return (
              <div key={commodity.id} className="glass-darker rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">{commodity.name} Price Prediction</h3>
                  {prediction && (
                    <div className="text-sm text-muted-foreground">
                      Confidence: {(prediction.confidence * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
                <div className="h-64 relative">
                  {prediction ? (
                    <canvas 
                      id={`${commodity.symbol.toLowerCase()}Chart`} 
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
                {prediction && (
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Current: </span>
                      <span className="font-mono">{selectedCurrency} {prediction.currentPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Predicted: </span>
                      <span className="font-mono">{selectedCurrency} {prediction.predictedPrice.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
