import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import jarvisCore from '@/assets/jarvis-core.png';

const Index = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isJarvisActive, setIsJarvisActive] = useState(false);

  const activateJarvis = () => {
    setIsJarvisActive(true);
    // The ElevenLabs widget will handle the actual conversation
    // This is just for visual feedback
    setTimeout(() => {
      setIsJarvisActive(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="w-full p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-primary rounded-full shadow-glow-sm"></div>
            <h1 className="text-2xl font-bold text-foreground tracking-wider jarvis-text-glow">JARVIS</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isOnline ? "bg-primary shadow-glow-sm" : "bg-muted"
            )}></div>
            <span className="text-sm text-muted-foreground">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 p-8">
        
        {/* JARVIS Core Image with Ambient Rings */}
        <div className="relative">
          <div className={cn(
            "transition-all duration-700 ease-out",
            isJarvisActive && "scale-105"
          )}>
            <img 
              src={jarvisCore} 
              alt="JARVIS AI Core" 
              className="w-64 h-64 object-contain"
            />
          </div>
          
          {/* Smooth ambient rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={cn(
              "w-72 h-72 rounded-full border border-primary/15 transition-all duration-1000 ease-in-out",
              isJarvisActive && "border-primary/30 scale-110 shadow-glow"
            )}
            style={{
              background: isJarvisActive 
                ? 'radial-gradient(circle, hsl(var(--primary) / 0.03), transparent 70%)'
                : 'radial-gradient(circle, hsl(var(--primary) / 0.01), transparent 70%)'
            }}></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={cn(
              "w-80 h-80 rounded-full border border-primary/8 transition-all duration-1500 ease-in-out",
              isJarvisActive && "border-primary/20 scale-110"
            )}
            style={{
              background: isJarvisActive 
                ? 'radial-gradient(circle, hsl(var(--primary) / 0.02), transparent 80%)'
                : 'radial-gradient(circle, hsl(var(--primary) / 0.005), transparent 80%)'
            }}></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={cn(
              "w-96 h-96 rounded-full border border-primary/5 transition-all duration-2000 ease-in-out",
              isJarvisActive && "border-primary/15 scale-105"
            )}></div>
          </div>
        </div>

        {/* Active JARVIS Button */}
        <Button
          size="lg"
          onClick={activateJarvis}
          className={cn(
            "px-8 py-4 bg-jarvis-surface hover:bg-jarvis-surface-hover border border-primary/30 shadow-glow transition-all duration-300",
            "text-primary font-semibold tracking-wide",
            isJarvisActive && "scale-105 shadow-glow-lg border-primary/50"
          )}
        >
          <Mic className="w-5 h-5 mr-2" />
          ACTIVE JARVIS
        </Button>

        {/* ElevenLabs Conversational AI Widget */}
        <div className="mt-8 flex justify-center">
          <elevenlabs-convai agent-id="agent_1501k3zkvzzneghbs3zk1ssnjpbf"></elevenlabs-convai>
        </div>
      </div>

      {/* Footer hint */}
      <div className="w-full p-6">
        <p className="text-center text-xs text-muted-foreground">
          Activate JARVIS to begin your conversation
        </p>
      </div>
    </div>
  );
};

export default Index;