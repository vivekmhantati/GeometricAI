import { TrendingUp, Brain, Globe, Database, Shield, Settings } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Advanced Forecasting",
    description: "LSTM and ARIMA models provide accurate price predictions across multiple time horizons with confidence intervals.",
    gradient: "from-primary to-blue-600"
  },
  {
    icon: Brain,
    title: "AI Chat Assistant",
    description: "Natural language processing understands your queries and provides instant market insights and predictions.",
    gradient: "from-green-500 to-green-600"
  },
  {
    icon: Globe,
    title: "Multi-Currency Support",
    description: "Real-time currency conversion displays predictions in USD, EUR, INR, and more using live exchange rates.",
    gradient: "from-yellow-500 to-yellow-600"
  },
  {
    icon: Database,
    title: "Real-Time Data",
    description: "Continuous data feeds from major exchanges ensure predictions reflect current market conditions.",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption and security protocols protect your data and trading strategies.",
    gradient: "from-red-500 to-red-600"
  },
  {
    icon: Settings,
    title: "API Integration",
    description: "RESTful APIs enable seamless integration with your existing trading platforms and applications.",
    gradient: "from-indigo-500 to-indigo-600"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Powerful <span className="text-primary">AI Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Advanced machine learning algorithms analyze market patterns to deliver unprecedented prediction accuracy
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="glass-darker rounded-2xl p-8 hover:bg-background/10 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
