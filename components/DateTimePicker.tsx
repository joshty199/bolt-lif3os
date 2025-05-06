import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';

interface DateTimePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  mode: 'date' | 'time';
  currentValue?: string | null;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const BUFFER_ITEMS = 10;

export default function DateTimePicker({ visible, onClose, onSelect, mode, currentValue }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('PM');
  
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const periodScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (currentValue) {
      if (mode === 'date') {
        setSelectedDate(new Date(currentValue));
        setCurrentMonth(new Date(currentValue));
      } else {
        const [time, period] = currentValue.split(' ');
        const [hour, minute] = time.split(':');
        setSelectedHour(parseInt(hour));
        setSelectedMinute(parseInt(minute));
        setSelectedPeriod(period);
      }
    }
  }, [currentValue, mode]);

  const generateTimeOptions = () => {
    const hours = Array.from({ length: 12 * (2 * BUFFER_ITEMS + 1) }, (_, i) => {
      const hour = (i % 12) + 1;
      return hour;
    });

    const minutes = Array.from({ length: 60 * (2 * BUFFER_ITEMS + 1) }, (_, i) => {
      const minute = i % 60;
      return minute;
    });

    const periods = Array.from({ length: 2 * (2 * BUFFER_ITEMS + 1) }, (_, i) => {
      return i % 2 === 0 ? 'AM' : 'PM';
    });

    return { hours, minutes, periods };
  };

  const handleTimeScroll = (event: any, type: 'hour' | 'minute' | 'period') => {
    const y = event.nativeEvent.contentOffset.y;
    const itemHeight = ITEM_HEIGHT;
    let index = Math.round(y / itemHeight);

    if (type === 'hour') {
      const hour = ((index % 12) + 1);
      setSelectedHour(hour);
      
      if (index < BUFFER_ITEMS || index > BUFFER_ITEMS * 3) {
        const middleIndex = BUFFER_ITEMS * 2 * 12 + (hour - 1);
        hourScrollRef.current?.scrollTo({ y: middleIndex * itemHeight, animated: false });
      }
    } else if (type === 'minute') {
      const minute = index % 60;
      setSelectedMinute(minute);
      
      if (index < BUFFER_ITEMS || index > BUFFER_ITEMS * 3) {
        const middleIndex = BUFFER_ITEMS * 2 * 60 + minute;
        minuteScrollRef.current?.scrollTo({ y: middleIndex * itemHeight, animated: false });
      }
    } else if (type === 'period') {
      const period = index % 2 === 0 ? 'AM' : 'PM';
      setSelectedPeriod(period);
      
      if (index < BUFFER_ITEMS || index > BUFFER_ITEMS * 3) {
        const middleIndex = BUFFER_ITEMS * 2 * 2 + (period === 'AM' ? 0 : 1);
        periodScrollRef.current?.scrollTo({ y: middleIndex * itemHeight, animated: false });
      }
    }
  };

  const handleTimePress = (type: 'hour' | 'minute' | 'period', value: number | string) => {
    let scrollRef: React.RefObject<ScrollView>;
    let middleIndex: number;

    switch (type) {
      case 'hour':
        setSelectedHour(value as number);
        scrollRef = hourScrollRef;
        middleIndex = BUFFER_ITEMS * 2 * 12 + ((value as number) - 1);
        break;
      case 'minute':
        setSelectedMinute(value as number);
        scrollRef = minuteScrollRef;
        middleIndex = BUFFER_ITEMS * 2 * 60 + (value as number);
        break;
      case 'period':
        setSelectedPeriod(value as string);
        scrollRef = periodScrollRef;
        middleIndex = BUFFER_ITEMS * 2 * 2 + (value === 'AM' ? 0 : 1);
        break;
    }

    scrollRef.current?.scrollTo({
      y: middleIndex * ITEM_HEIGHT,
      animated: true,
    });
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    onSelect(newDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }));
  };

  const handleTimeSelect = () => {
    const timeString = `${selectedHour}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;
    onSelect(timeString);
  };

  const changeMonth = (delta: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
  };

  if (mode === 'time') {
    const { hours, minutes, periods } = generateTimeOptions();

    useEffect(() => {
      if (visible) {
        const hourIndex = BUFFER_ITEMS * 2 * 12 + (selectedHour - 1);
        const minuteIndex = BUFFER_ITEMS * 2 * 60 + selectedMinute;
        const periodIndex = BUFFER_ITEMS * 2 * 2 + (selectedPeriod === 'AM' ? 0 : 1);

        requestAnimationFrame(() => {
          hourScrollRef.current?.scrollTo({ y: hourIndex * ITEM_HEIGHT, animated: false });
          minuteScrollRef.current?.scrollTo({ y: minuteIndex * ITEM_HEIGHT, animated: false });
          periodScrollRef.current?.scrollTo({ y: periodIndex * ITEM_HEIGHT, animated: false });
        });
      }
    }, [visible]);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Select Time</Text>
              <TouchableOpacity onPress={onClose}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.timePickerContainer}>
              <View style={styles.timeColumn}>
                <ScrollView
                  ref={hourScrollRef}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  style={styles.scrollColumn}
                  contentContainerStyle={styles.scrollContent}
                  onMomentumScrollEnd={(e) => handleTimeScroll(e, 'hour')}
                >
                  {hours.map((hour, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeItem,
                        selectedHour === hour && styles.selectedTimeItem
                      ]}
                      onPress={() => handleTimePress('hour', hour)}
                    >
                      <Text style={[
                        styles.timeText,
                        selectedHour === hour && styles.selectedTimeText
                      ]}>
                        {hour}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text style={styles.timeSeparator}>:</Text>

              <View style={styles.timeColumn}>
                <ScrollView
                  ref={minuteScrollRef}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  style={styles.scrollColumn}
                  contentContainerStyle={styles.scrollContent}
                  onMomentumScrollEnd={(e) => handleTimeScroll(e, 'minute')}
                >
                  {minutes.map((minute, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeItem,
                        selectedMinute === minute && styles.selectedTimeItem
                      ]}
                      onPress={() => handleTimePress('minute', minute)}
                    >
                      <Text style={[
                        styles.timeText,
                        selectedMinute === minute && styles.selectedTimeText
                      ]}>
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.timeColumn}>
                <ScrollView
                  ref={periodScrollRef}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  style={styles.scrollColumn}
                  contentContainerStyle={styles.scrollContent}
                  onMomentumScrollEnd={(e) => handleTimeScroll(e, 'period')}
                >
                  {periods.map((period, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeItem,
                        selectedPeriod === period && styles.selectedTimeItem
                      ]}
                      onPress={() => handleTimePress('period', period)}
                    >
                      <Text style={[
                        styles.timeText,
                        selectedPeriod === period && styles.selectedTimeText
                      ]}>
                        {period}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={() => {
                  handleTimeSelect();
                  onClose();
                }}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const days = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    if (day > 0 && day <= daysInMonth) {
      return day;
    }
    return null;
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Date</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.monthYear}>
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <View style={styles.calendarControls}>
                <TouchableOpacity 
                  style={styles.calendarButton}
                  onPress={() => changeMonth(-1)}
                >
                  <ChevronLeft size={20} color="#64748B" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.calendarButton}
                  onPress={() => changeMonth(1)}
                >
                  <ChevronRight size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.weekDaysHeader}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <Text key={index} style={styles.weekDayText}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {days.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    day === selectedDate.getDate() &&
                    currentMonth.getMonth() === selectedDate.getMonth() &&
                    currentMonth.getFullYear() === selectedDate.getFullYear() &&
                    styles.selectedDay,
                    !day && styles.disabledDay,
                  ]}
                  onPress={() => day && handleDateSelect(day)}
                  disabled={!day}
                >
                  <Text
                    style={[
                      styles.dayText,
                      day === selectedDate.getDate() &&
                      currentMonth.getMonth() === selectedDate.getMonth() &&
                      currentMonth.getFullYear() === selectedDate.getFullYear() &&
                      styles.selectedDayText,
                      !day && styles.disabledDayText,
                    ]}
                  >
                    {day || ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={() => {
                handleDateSelect(selectedDate.getDate());
                onClose();
              }}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    paddingVertical: 16,
  },
  timeColumn: {
    width: 60,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
  },
  scrollColumn: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: ITEM_HEIGHT * 2,
  },
  timeItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTimeItem: {
    backgroundColor: '#EFF6FF',
  },
  timeText: {
    fontSize: 20,
    color: '#1E293B',
  },
  selectedTimeText: {
    color: '#4361EE',
    fontWeight: '600',
  },
  timeSeparator: {
    fontSize: 24,
    color: '#1E293B',
    marginHorizontal: 8,
  },
  calendarContainer: {
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  calendarControls: {
    flexDirection: 'row',
    gap: 8,
  },
  calendarButton: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    color: '#1E293B',
  },
  selectedDay: {
    backgroundColor: '#4361EE',
    borderRadius: 8,
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  disabledDay: {
    opacity: 0.3,
  },
  disabledDayText: {
    color: '#94A3B8',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
  },
  confirmButton: {
    backgroundColor: '#4361EE',
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});