import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

import { AuthOnboardingScreen } from '../screens/AuthOnboardingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { JobManagementScreen } from '../screens/JobManagementScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { EarningsScreen } from '../screens/EarningsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SupportScreen } from '../screens/SupportScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.white,
    border: colors.border,
    primary: colors.purple,
  },
};

const TAB_ICONS: Record<
  string,
  { active: keyof typeof Ionicons.glyphMap; idle: keyof typeof Ionicons.glyphMap }
> = {
  Home: { active: 'home', idle: 'home-outline' },
  Jobs: { active: 'construct', idle: 'construct-outline' },
  Schedule: { active: 'calendar', idle: 'calendar-outline' },
  Earnings: { active: 'wallet', idle: 'wallet-outline' },
  Support: { active: 'help-buoy', idle: 'help-buoy-outline' },
  Profile: { active: 'person', idle: 'person-outline' },
};

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 12);

  return (
    <View style={[styles.tabWrap, { paddingBottom: bottomPad }]} pointerEvents="box-none">
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const meta = TAB_ICONS[route.name] || { active: 'ellipse', idle: 'ellipse-outline' };

          const onPress = () => {
            navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              onPress={onPress}
              style={styles.tabItem}
            >
              <View style={[styles.tabCircle, isFocused && styles.tabCircleActive]}>
                <Ionicons
                  name={isFocused ? meta.active : meta.idle}
                  size={20}
                  color={isFocused ? colors.white : '#8A8A8A'}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export function ServiceAppNavigator() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  if (!currentUser) {
    return <AuthOnboardingScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  function MainTabs() {
    return (
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Home">
          {(props) => (
            <HomeScreen
              {...props}
              user={currentUser}
              onNavigateToJob={() => props.navigation.navigate('Jobs')}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Jobs" component={JobManagementScreen} />
        <Tab.Screen name="Schedule" component={ScheduleScreen} />
        <Tab.Screen name="Earnings" component={EarningsScreen} />
        <Tab.Screen name="Support" component={SupportScreen} />
        <Tab.Screen name="Profile">
          {(props) => (
            <ProfileScreen {...props} user={currentUser} onSignOut={() => setCurrentUser(null)} />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#111111',
    borderRadius: 40,
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: '92%',
    maxWidth: 380,
    borderWidth: 1.5,
    borderColor: '#252525',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.7,
        shadowRadius: 28,
        shadowOffset: { width: 0, height: 12 },
      },
      android: { elevation: 28 },
    }),
  },
  tabItem: {
    padding: 4,
  },
  tabCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabCircleActive: {
    backgroundColor: colors.purple,
  },
});
