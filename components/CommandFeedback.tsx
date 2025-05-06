import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Check, CircleAlert as AlertCircle, Loader as Loader2 } from 'lucide-react-native';

type ProcessingState = 'idle' | 'processing' | 'success' | 'error';

interface CommandFeedbackProps {
  processingState: ProcessingState;
  lastCommand: string | null;
}

export default function CommandFeedback({ processingState, lastCommand }: CommandFeedbackProps) {
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (processingState === 'processing' || processingState === 'success' || processingState === 'error') {
      setVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      ]).start();
    }

    // Auto-hide feedback after success or error
    if (processingState === 'success' || processingState === 'error') {
      const timer = setTimeout(() => {
        hideFeedback();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [processingState]);

  // Rotation animation for the loading spinner
  useEffect(() => {
    if (processingState === 'processing') {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [processingState]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const hideFeedback = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start(() => {
      setVisible(false);
    });
  };

  if (!visible) return null;

  let icon = null;
  let message = '';
  let statusColor = '#3B82F6';

  switch (processingState) {
    case 'processing':
      icon = <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Loader2 size={20} color="#3B82F6" />
             </Animated.View>;
      message = 'Processing your command...';
      break;
    case 'success':
      icon = <Check size={20} color="#10B981" />;
      message = 'Command processed successfully!';
      statusColor = '#10B981';
      break;
    case 'error':
      icon = <AlertCircle size={20} color="#EF4444" />;
      message = 'There was a problem processing your command';
      statusColor = '#EF4444';
      break;
  }

  return (
    <Animated.View 
      style={[
        styles.container, 
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${statusColor}20` }]}>
        {icon}
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>{message}</Text>
        {lastCommand && <Text style={styles.command} numberOfLines={1}>"{lastCommand}"</Text>}
      </View>
      <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  command: {
    fontSize: 13,
    color: '#64748B',
  },
  statusIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
});