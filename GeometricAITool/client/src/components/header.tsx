import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/hooks/use-theme";
import { Search, Menu, X } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const { theme, setTheme } = useTheme();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="glass-darker fixed w-full top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-primary bg-clip-text text-transparent">
              GEMETRICS AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('markets')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Markets
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Search and Currency Selector */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search commodities..."
                className="bg-background/10 border-border pl-4 pr-10 text-sm w-48"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>
            
            {/* Currency Selector */}
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="bg-background/10 border-border w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>

            {/* Theme Selector */}
            <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
              <SelectTrigger className="bg-background/10 border-border w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="cyber">Cyber</SelectItem>
                <SelectItem value="light">Light</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass-darker border-t border-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4 mb-4">
              <button 
                onClick={() => scrollToSection('home')} 
                className="text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('markets')} 
                className="text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Markets
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Contact
              </button>
            </nav>
            <div className="flex flex-col space-y-3">
              <Input
                type="text"
                placeholder="Search commodities..."
                className="bg-background/10 border-border"
              />
              <div className="flex space-x-3">
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="bg-background/10 border-border flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
                  <SelectTrigger className="bg-background/10 border-border flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
