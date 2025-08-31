import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'jarvis';
  content: string;
  timestamp: Date;
}

const JarvisInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Simulate transcription (replace with actual ElevenLabs API call)
      const transcription = "Hello JARVIS, what's the weather like today?";
      
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: transcription,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      // Send to webhook (replace with your actual webhook URL)
      const webhookResponse = await sendToWebhook(transcription);
      
      // Add JARVIS response
      const jarvisMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'jarvis',
        content: webhookResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, jarvisMessage]);

    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process audio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const sendToWebhook = async (message: string): Promise<string> => {
    try {
      // Replace with your actual webhook URL
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      if (!response.ok) throw new Error('Webhook failed');
      
      const data = await response.json();
      return data.response || "I'm here to assist you. How can I help?";
    } catch (error) {
      return "I apologize, but I'm having trouble processing your request right now. Please try again.";
    }
  };

  const addSampleMessage = () => {
    const sampleMessages: Message[] = [
      {
        id: '1',
        type: 'jarvis',
        content: "Good evening. JARVIS is online and ready to assist you.",
        timestamp: new Date()
      }
    ];
    setMessages(sampleMessages);
  };

  // Add welcome message on component mount
  useEffect(() => {
    addSampleMessage();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse-glow"></div>
            <h1 className="text-3xl font-bold text-foreground tracking-wider">JARVIS</h1>
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

      {/* Central Voice Interface */}
      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center space-y-8">
        
        {/* Voice Indicator */}
        <div className="relative">
          <div className={cn(
            "w-32 h-32 rounded-full border-2 border-primary/30 flex items-center justify-center transition-all duration-300",
            isRecording && "animate-recording-pulse shadow-glow-lg",
            isProcessing && "animate-pulse-glow"
          )}>
            <div className={cn(
              "w-20 h-20 rounded-full bg-gradient-jarvis flex items-center justify-center transition-all duration-300",
              (isRecording || isProcessing) && "scale-110"
            )}>
              <div className="w-12 h-12 rounded-full bg-primary/50 shadow-glow"></div>
            </div>
          </div>
          
          {/* Recording status */}
          {isRecording && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <p className="text-sm text-primary animate-pulse">Listening...</p>
            </div>
          )}
          
          {isProcessing && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <p className="text-sm text-primary animate-pulse">Processing...</p>
            </div>
          )}
        </div>

        {/* Voice Control Button */}
        <Button
          size="lg"
          variant={isRecording ? "destructive" : "default"}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={cn(
            "w-16 h-16 rounded-full transition-all duration-300",
            !isRecording && "bg-jarvis-surface hover:bg-jarvis-surface-hover border border-primary/30 shadow-glow",
            isRecording && "animate-recording-pulse"
          )}
        >
          {isRecording ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>

        {/* Chat Interface */}
        {messages.length > 0 && (
          <Card className="w-full max-w-2xl h-96 bg-jarvis-surface/50 border-primary/20 backdrop-blur-sm">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.type === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-xs px-4 py-2 rounded-lg animate-fade-in-up",
                        message.type === 'user'
                          ? "bg-primary/20 text-foreground border border-primary/30"
                          : "bg-jarvis-surface text-foreground border border-primary/20 shadow-glow-sm"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="w-full max-w-4xl mt-8">
        <p className="text-center text-xs text-muted-foreground">
          Press and hold the microphone to speak with JARVIS
        </p>
      </div>
    </div>
  );
};

export default JarvisInterface;