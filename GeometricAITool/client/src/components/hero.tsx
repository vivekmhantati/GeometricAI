import { Button } from "@/components/ui/button";
import { Bot, Eye } from "lucide-react";
import { useState } from "react";

interface HeroProps {
  onOpenChat?: () => void;
}

export default function Hero({ onOpenChat }: HeroProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleChatClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    onOpenChat?.();
  };

  const scrollToMarkets = () => {
    const element = document.getElementById('markets');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="home" className="pt-20 min-h-screen flex items-center relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
        }}
      />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Future Markets{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-primary bg-clip-text text-transparent">
                Revealed
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
              AI-Powered Commodity Price Prediction with Real-Time Analytics
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={handleChatClick}
                className={`bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white px-8 py-4 h-auto text-lg font-semibold animate-pulse-soft transition-all duration-300 ${
                  isPressed ? 'scale-95' : 'hover:scale-105'
                }`}
              >
                <Bot className="mr-2 w-5 h-5" />
                Ask GEMETRICS
              </Button>
              <Button
                onClick={scrollToMarkets}
                variant="outline"
                className="glass border-border text-foreground px-8 py-4 h-auto text-lg font-semibold hover:bg-background/20 transition-all duration-300"
              >
                <Eye className="mr-2 w-5 h-5" />
                View Markets
              </Button>
            </div>
          </div>
          
          {/* Hero Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-darker rounded-xl p-6 text-center animate-float">
              <div className="text-3xl font-bold text-green-500 mb-2">94.7%</div>
              <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
            </div>
            <div className="glass-darker rounded-xl p-6 text-center animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="text-3xl font-bold text-yellow-500 mb-2">15+</div>
              <div className="text-sm text-muted-foreground">Commodities Tracked</div>
            </div>
            <div className="glass-darker rounded-xl p-6 text-center animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Real-Time Updates</div>
            </div>
            <div className="glass-darker rounded-xl p-6 text-center animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="text-3xl font-bold text-purple-400 mb-2">5M+</div>
              <div className="text-sm text-muted-foreground">Data Points</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
