import { User } from "lucide-react";

const testimonials = [
  {
    text: "GEMETRICS AI has revolutionized our commodity trading strategy. The predictions are incredibly accurate and have helped us increase our portfolio performance by 34%.",
    author: "Sarah Chen",
    role: "Senior Commodities Trader",
    gradient: "from-primary to-blue-600"
  },
  {
    text: "The AI chatbot is incredibly intuitive. I can ask complex market questions in plain English and get detailed, actionable insights immediately.",
    author: "Michael Rodriguez", 
    role: "Investment Analyst",
    gradient: "from-green-500 to-green-600"
  },
  {
    text: "The multi-currency feature is fantastic for our international operations. We can view predictions in local currencies which helps with our regional strategies.",
    author: "Emma Thompson",
    role: "Hedge Fund Manager", 
    gradient: "from-yellow-500 to-yellow-600"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            What Our <span className="text-primary">Users Say</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glass-darker rounded-2xl p-8 text-center">
              <div className={`w-16 h-16 bg-gradient-to-r ${testimonial.gradient} rounded-full mx-auto mb-6 flex items-center justify-center`}>
                <User className="w-8 h-8 text-white" />
              </div>
              <p className="text-muted-foreground mb-6 italic">"{testimonial.text}"</p>
              <h4 className="font-bold text-primary">{testimonial.author}</h4>
              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
