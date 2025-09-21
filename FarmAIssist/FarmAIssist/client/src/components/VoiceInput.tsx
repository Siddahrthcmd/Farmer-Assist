import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";

interface VoiceInputProps {
  onTranscription?: (text: string, language: string) => void;
  disabled?: boolean;
}

export default function VoiceInput({ 
  onTranscription = (text, lang) => console.log('Voice transcription:', text, 'Language:', lang),
  disabled = false
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const startListening = () => {
    if (!isSupported || disabled) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'ml-IN'; // Malayalam by default, can be made configurable

    recognition.onstart = () => {
      setIsListening(true);
      console.log('Voice recognition started');
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
      
      if (event.results[current].isFinal) {
        onTranscription(transcript, 'malayalam');
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Voice recognition ended');
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
  };

  if (!isSupported) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Volume2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Voice input not supported in this browser
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`transition-all duration-200 ${isListening ? 'ring-2 ring-primary border-primary' : ''}`}>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <Button
            size="lg"
            variant={isListening ? "destructive" : "default"}
            onClick={isListening ? stopListening : startListening}
            disabled={disabled}
            data-testid="button-voice-toggle"
            className="w-20 h-20 rounded-full"
          >
            {isListening ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {isListening ? 'Listening...' : 'Click to speak'}
            </p>
            
            {transcript && (
              <div className="bg-muted p-3 rounded-md text-sm" data-testid="text-transcript">
                {transcript}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Speak in Malayalam, Hindi, Tamil, or English
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}