import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

interface UseVoiceInputProps {
  onTranscript: (text: string) => void;
  onStateChange?: (isRecording: boolean) => void;
}

export function useVoiceInput({ onTranscript, onStateChange }: UseVoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event: any) => {
          const result = event.results[event.results.length - 1];
          if (result.isFinal) {
            onTranscript(result[0].transcript);
          }
        };

        recognitionInstance.onend = () => {
          if (isRecording) {
            recognitionInstance.start();
          } else {
            setIsRecording(false);
            onStateChange?.(false);
          }
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          onStateChange?.(false);
        };

        setRecognition(recognitionInstance);
      }
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);

  const startRecording = () => {
    if (Platform.OS === 'web') {
      if (!recognition) {
        onTranscript('Speech recognition is not supported in this browser');
        return;
      }

      try {
        recognition.start();
        setIsRecording(true);
        onStateChange?.(true);
      } catch (error) {
        console.error('Error starting recording:', error);
        onTranscript('There was an error starting speech recognition');
        setIsRecording(false);
        onStateChange?.(false);
      }
    } else {
      setIsRecording(true);
      onStateChange?.(true);
      setTimeout(() => {
        onTranscript('Voice input is only available on web platforms');
        setIsRecording(false);
        onStateChange?.(false);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (Platform.OS === 'web' && recognition) {
      recognition.stop();
      setIsRecording(false);
      onStateChange?.(false);
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
}