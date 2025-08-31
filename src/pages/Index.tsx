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
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse-glow"></div>
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
        
        {/* JARVIS Core Image */}
        <div className="relative">
          <div className={cn(
            "transition-all duration-500",
            isJarvisActive && "scale-110"
          )}>
            <img 
              src={jarvisCore} 
              alt="JARVIS AI Core" 
              className={cn(
                "w-64 h-64 object-contain transition-all duration-300",
                isJarvisActive ? "animate-pulse-glow" : "animate-pulse-glow"
              )}
            />
          </div>
          
          {/* Pulsing rings around the core */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={cn(
              "w-72 h-72 rounded-full border border-primary/20 animate-pulse-glow",
              isJarvisActive && "border-primary/40 scale-110"
            )}></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={cn(
              "w-80 h-80 rounded-full border border-primary/10 animate-pulse-glow animation-delay-1000",
              isJarvisActive && "border-primary/30 scale-110"
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
            isJarvisActive && "animate-recording-pulse scale-105 shadow-glow-lg"
          )}
        >
          <Mic className="w-5 h-5 mr-2" />
          ACTIVE JARVIS
        </Button>

        {/* ElevenLabs Conversational AI Widget */}
        <div className="mt-8 flex justify-center">
          <elevenlabs-convai agent-id="xyWFCQVZhNL.e1xZItTul"></elevenlabs-convai>
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