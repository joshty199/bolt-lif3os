import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useState, useRef } from 'react';
import { 
  Chrome as Home,
  BookOpen,
  Users,
  DollarSign,
  Dumbbell,
  Target,
  Plane,
  ChevronRight,
  Menu,
  LayoutGrid,
  Newspaper,
  Trophy,
  Goal,
  Scissors,
  X,
  Bot,
  Settings,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs, useRouter } from 'expo-router';
import CommandBar from '../../components/CommandBar';
import { CommandProvider } from '../../context/CommandContext';

const MENU_ITEMS = [
  { name: "butler", label: "Butler", icon: Bot },
  { name: "index", label: "Dashboard", icon: Home },
  { name: "journal", label: "Journal", icon: BookOpen },
  { name: "tasks", label: "Tasks", icon: Target },
  { name: "looksmaxing", label: "Looksmaxing", icon: Scissors },
  { name: "fitness", label: "Fitness", icon: Dumbbell },
  { name: "contacts", label: "Contacts", icon: Users },
  { name: "travel", label: "Travel", icon: Plane },
  { name: "finance", label: "Finance", icon: DollarSign },
  { name: "goals", label: "Goal Planning", icon: Goal },
  { name: "news", label: "News Hub", icon: Newspaper },
  { name: "achievements", label: "Achievement Center", icon: Trophy },
  { name: "settings", label: "Settings", icon: Settings },
];

export default function TabLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [menuState, setMenuState] = useState<'full' | 'icons' | 'collapsed'>('collapsed');
  const translateX = useRef(new Animated.Value(-320)).current;
  const contentMargin = useRef(new Animated.Value(0)).current;
  
  const animateMenu = (toState: 'full' | 'icons' | 'collapsed') => {
    const values = {
      full: { translate: 0, margin: 320 },
      icons: { translate: 0, margin: 72 },
      collapsed: { translate: -320, margin: 0 }
    };

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: values[toState].translate,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(contentMargin, {
        toValue: values[toState].margin,
        duration: 300,
        useNativeDriver: false
      })
    ]).start();

    setMenuState(toState);
  };

  const toggleMenu = () => {
    const nextState = {
      full: 'icons',
      icons: 'collapsed',
      collapsed: 'full'
    }[menuState];

    animateMenu(nextState);
  };

  const handleNavigate = (routeName: string) => {
    router.push(routeName as any);
    if (menuState === 'full') {
      animateMenu('icons');
    }
  };

  return (
    <CommandProvider>
      <View style={styles.container}>
        <Animated.View style={[
          styles.sidebar,
          { transform: [{ translateX }] },
          menuState === 'icons' && styles.sidebarIcons,
          { width: menuState === 'full' ? '100%' : menuState === 'icons' ? 72 : 320 }
        ]}>
          <View style={[styles.sidebarHeader, { paddingTop: insets.top + 16 }]}>
            <LayoutGrid size={24} color="#4361EE" />
            {menuState === 'full' && (
              <>
                <Text style={styles.sidebarTitle}>Modules</Text>
                <TouchableOpacity style={styles.toggleButton} onPress={toggleMenu}>
                  <X size={20} color="#64748B" />
                </TouchableOpacity>
              </>
            )}
            {menuState === 'icons' && (
              <TouchableOpacity style={styles.toggleButton} onPress={toggleMenu}>
                <ChevronRight size={20} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>
          
          <ScrollView 
            style={styles.menuItems} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuItemsContent}
          >
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.name}
                  style={[
                    styles.menuItem,
                    menuState === 'icons' && styles.menuItemCollapsed
                  ]}
                  onPress={() => handleNavigate(item.name)}
                >
                  <Icon size={24} color="#64748B" />
                  {menuState === 'full' && (
                    <Text style={styles.menuItemText}>{item.label}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        <Animated.View style={[styles.content, { marginLeft: contentMargin }]}>
          <TouchableOpacity 
            style={[styles.hamburgerButton, { top: insets.top + 16, left: 16 }]}
            onPress={toggleMenu}
          >
            <Menu size={24} color="#64748B" />
          </TouchableOpacity>

          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: { display: 'none' }
            }}>
            <Tabs.Screen name="butler" options={{ title: "Butler" }} />
            <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
            <Tabs.Screen name="journal" options={{ title: "Journal" }} />
            <Tabs.Screen name="tasks" options={{ title: "Tasks" }} />
            <Tabs.Screen name="looksmaxing" options={{ title: "Looksmaxing" }} />
            <Tabs.Screen name="fitness" options={{ title: "Fitness" }} />
            <Tabs.Screen name="contacts" options={{ title: "Contacts" }} />
            <Tabs.Screen name="travel" options={{ title: "Travel" }} />
            <Tabs.Screen name="finance" options={{ title: "Finance" }} />
            <Tabs.Screen name="goals" options={{ title: "Goal Planning" }} />
            <Tabs.Screen name="news" options={{ title: "News Hub" }} />
            <Tabs.Screen name="achievements" options={{ title: "Achievement Center" }} />
            <Tabs.Screen name="settings" options={{ title: "Settings" }} />
          </Tabs>
        </Animated.View>

        <View style={[styles.commandBarContainer, { paddingBottom: insets.bottom }]}>
          <CommandBar />
        </View>
      </View>
    </CommandProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  hamburgerButton: {
    position: 'absolute',
    zIndex: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    zIndex: 100,
  },
  sidebarIcons: {
    width: 72,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  toggleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItems: {
    flex: 1,
  },
  menuItemsContent: {
    padding: 16,
    paddingBottom: 100,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    gap: 16,
    marginBottom: 8,
  },
  menuItemCollapsed: {
    justifyContent: 'center',
    padding: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  commandBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});