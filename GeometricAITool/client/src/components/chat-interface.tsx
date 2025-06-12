import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Bot, User, X, Send, Circle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatResponse {
  response: string;
  chartData?: any;
  commoditySymbol?: string;
  queryAnalysis?: any;
}

export default function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm GEMETRICS AI. Ask me about commodity prices, market predictions, or any trading questions you have.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for chat open events from Hero component
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };

    // Find and attach event listener to the "Ask GEMETRICS" button
    const chatButton = document.querySelector('[data-chat-trigger]') || 
                      document.getElementById('openChat') ||
                      document.querySelector('button:has([data-testid="bot"])') ||
                      Array.from(document.querySelectorAll('button')).find(btn => 
                        btn.textContent?.includes('Ask GEMETRICS') || 
                        btn.textContent?.includes('GEMETRICS')
                      );

    if (chatButton) {
      chatButton.addEventListener('click', handleOpenChat);
      return () => chatButton.removeEventListener('click', handleOpenChat);
    }

    // Fallback: listen for global chat events
    const handleGlobalChatEvent = (event: CustomEvent) => {
      if (event.detail === 'openChat') {
        setIsOpen(true);
      }
    };

    window.addEventListener('openGemetricsChat' as any, handleGlobalChatEvent);
    return () => window.removeEventListener('openGemetricsChat' as any, handleGlobalChatEvent);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/chat", { 
        message: inputMessage,
        currency: "USD" // This could be made dynamic based on user selection
      });
      
      const data: ChatResponse = await response.json();
      
      const botMessage: Message = {
        text: data.response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // If there's chart data, we could trigger a chart update here
      if (data.chartData && data.commoditySymbol) {
        // Emit event to update charts in Markets component
        window.dispatchEvent(new CustomEvent('updateChart', {
          detail: {
            symbol: data.commoditySymbol,
            chartData: data.chartData
          }
        }));
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        text: "Sorry, I'm having trouble processing your request right now. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to get response from GEMETRICS AI",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[32rem] glass-darker rounded-2xl border border-border z-50 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold">GEMETRICS AI</h3>
              <div className="flex items-center space-x-1">
                <Circle className="w-2 h-2 text-green-500 fill-current" />
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex space-x-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
            {message.sender === 'bot' && (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-xs rounded-lg p-3 ${
              message.sender === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-background/20'
            }`}>
              <p className="text-sm">{message.text}</p>
            </div>
            {message.sender === 'user' && (
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-background/20 rounded-lg p-3 max-w-xs">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Ask about commodity prices..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-background/10 border-border text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            size="icon"
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
