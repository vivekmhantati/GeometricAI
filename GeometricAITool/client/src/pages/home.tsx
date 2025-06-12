import Header from "@/components/header";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Markets from "@/components/markets";
import HowItWorks from "@/components/how-it-works";
import About from "@/components/about";
import Testimonials from "@/components/testimonials";
import Newsletter from "@/components/newsletter";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import ChatInterface from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Markets />
        <HowItWorks />
        <About />
        <Testimonials />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
      <ChatInterface />
      
      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 w-12 h-12 rounded-full z-40 p-0"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
