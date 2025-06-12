export default function About() {
  return (
    <section id="about" className="py-20 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
        }}
      />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="GEMETRICS AI team of financial experts and data scientists" 
              className="rounded-2xl shadow-2xl"
            />
          </div>
          <div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              About <span className="text-primary">GEMETRICS AI</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              GEMETRICS AI combines cutting-edge artificial intelligence with deep financial market expertise to deliver unprecedented commodity price predictions.
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Our proprietary machine learning models analyze millions of data points from global markets, economic indicators, and geopolitical events to forecast commodity prices with remarkable accuracy.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Trusted by traders, analysts, and financial institutions worldwide, we're democratizing access to professional-grade market intelligence.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50M+</div>
                <div className="text-sm text-muted-foreground">Predictions Made</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">94.7%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
