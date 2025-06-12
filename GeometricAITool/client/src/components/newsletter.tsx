import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await apiRequest("POST", "/api/newsletter", { email });
      
      toast({
        title: "Success!",
        description: "You've been successfully subscribed to our newsletter",
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1610375461246-83df859d849d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
        }}
      />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="glass-darker rounded-3xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Stay Ahead of <span className="text-yellow-500">Market Trends</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get weekly AI insights, market predictions, and exclusive analysis delivered to your inbox
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-background/10 border-border"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary px-8"
              disabled={isLoading}
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
