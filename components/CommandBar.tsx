import { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated, Keyboard, Platform } from 'react-native';
import { Text } from 'react-native-web';
import { Mic, Send, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCommandProcessor } from '@/hooks/useCommandProcessor';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import CommandFeedback from './CommandFeedback';

export default function CommandBar() {
  const [command, setCommand] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [inputHeight, setInputHeight] = useState(44);
  const { processCommand, processingState, lastCommand } = useCommandProcessor();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;

  const { isRecording, startRecording, stopRecording } = useVoiceInput({
    onTranscript: (text) => {
      setCommand(text);
    },
    onStateChange: (recording) => {
      // Animate the expansion of the command bar
      Animated.timing(expandAnim, {
        toValue: recording ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    },
  });

  // Handle keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Recording pulse animation
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const handleVoicePress = () => {
    if (isRecording) {
      stopRecording();
      if (command) {
        handleSendCommand();
      }
    } else {
      setCommand('');
      startRecording();
    }
  };

  const handleSendCommand = () => {
    if (command.trim()) {
      processCommand(command);
      setCommand('');
      setInputHeight(44); // Reset input height
      Keyboard.dismiss();
    }
  };

  const handleClearCommand = () => {
    setCommand('');
    setInputHeight(44); // Reset input height
    inputRef.current?.focus();
  };

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const newHeight = Math.min(Math.max(44, height), 120); // Min 44px, max 120px
    setInputHeight(newHeight);
  };

  // Calculate translation based on keyboard and insets
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -16],
  });

  // Calculate container height based on recording state and input height
  const containerHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [inputHeight + 36, inputHeight + 96], // Add padding
  });

  return (
    <>
      <CommandFeedback 
        processingState={processingState} 
        lastCommand={lastCommand} 
      />
      <Animated.View style={[
        styles.container, 
        { 
          paddingBottom: insets.bottom + 8,
          height: containerHeight,
          transform: [{ translateY }] 
        }
      ]}>
        <View style={styles.inputRow}>
          <TouchableOpacity 
            style={[
              styles.micButton, 
              isRecording && styles.micButtonActive
            ]} 
            onPress={handleVoicePress}
          >
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Mic 
                size={22} 
                color={isRecording ? '#FFFFFF' : '#3B82F6'} 
                strokeWidth={2} 
              />
            </Animated.View>
          </TouchableOpacity>
          <View style={[styles.inputContainer, { height: inputHeight }]}>
            <TextInput
              ref={inputRef}
              style={[styles.input, { height: inputHeight }]}
              placeholder={isRecording ? "Listening..." : "Type a command or speak..."}
              placeholderTextColor="#94A3B8"
              value={command}
              onChangeText={setCommand}
              onSubmitEditing={handleSendCommand}
              returnKeyType="send"
              editable={!isRecording}
              multiline
              onContentSizeChange={handleContentSizeChange}
            />
            {command.length > 0 && !isRecording && (
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={handleClearCommand}
              >
                <X size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              !command && styles.sendButtonDisabled
            ]} 
            disabled={!command} 
            onPress={handleSendCommand}
          >
            <Send size={20} color={command ? '#FFFFFF' : '#94A3B8'} />
          </TouchableOpacity>
        </View>
        {isRecording && (
          <View style={styles.recordingInfo}>
            <Text style={styles.recordingText}>
              Tap the microphone again to stop recording
            </Text>
          </View>
        )}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    zIndex: 100,
    padding: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonActive: {
    backgroundColor: '#3B82F6',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderRadius: 22,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'center',
  },
  clearButton: {
    padding: 14,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
  recordingInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  recordingText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});