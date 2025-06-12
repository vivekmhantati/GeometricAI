const steps = [
  {
    number: 1,
    title: "Ask GEMETRICS",
    description: "Click \"Ask GEMETRICS\" and type your commodity question using natural language.",
    gradient: "from-primary to-blue-600"
  },
  {
    number: 2,
    title: "Get AI Analysis",
    description: "Our ML models analyze historical data and provide instant predictions with confidence levels.",
    gradient: "from-green-500 to-green-600"
  },
  {
    number: 3,
    title: "View Predictions",
    description: "Interactive charts update dynamically showing price forecasts in your preferred currency.",
    gradient: "from-yellow-500 to-yellow-600"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Three simple steps to access powerful AI-driven commodity predictions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className={`w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                <span className="text-2xl font-bold text-white">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
