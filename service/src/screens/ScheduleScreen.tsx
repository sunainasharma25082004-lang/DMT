import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme/colors';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDay, setSelectedDay] = useState('Wed');
  const [slots, setSlots] = useState({
    morning: true,
    afternoon: true,
    evening: false,
  });
  const [isOnLeave, setIsOnLeave] = useState(false);

  const toggleSlot = (key: keyof typeof slots) => {
    setSlots((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSchedule = () => {
    Alert.alert(
      'Schedule Saved! 📅',
      `Updated availability slots for ${selectedDay}. DMT dispatch algorithm will assign jobs accordingly.`
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Schedule & Availability</Text>

        {/* Day Selector Pill Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayRow}>
          {DAYS.map((d) => (
            <Pressable
              key={d}
              style={[styles.dayCard, selectedDay === d && styles.dayCardActive]}
              onPress={() => setSelectedDay(d)}
            >
              <Text style={[styles.dayText, selectedDay === d && styles.dayTextActive]}>{d}</Text>
              <View
                style={[
                  styles.dayDot,
                  selectedDay === d ? { backgroundColor: colors.white } : { backgroundColor: colors.purple },
                ]}
              />
            </Pressable>
          ))}
        </ScrollView>

        {/* Mark Holiday / Leave Banner */}
        <Pressable
          style={[styles.leaveBanner, isOnLeave && styles.leaveBannerActive]}
          onPress={() => {
            setIsOnLeave(!isOnLeave);
            Alert.alert(
              !isOnLeave ? 'Holiday Marked' : 'Working Day Restored',
              !isOnLeave ? `Marked ${selectedDay} as your official day off.` : `Available for bookings on ${selectedDay}.`
            );
          }}
        >
          <Ionicons
            name={isOnLeave ? 'bed' : 'sunny'}
            size={22}
            color={isOnLeave ? colors.warning : colors.purpleBright}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.leaveTitle}>
              {isOnLeave ? `Marked ON LEAVE for ${selectedDay}` : `Mark ${selectedDay} as Day Off`}
            </Text>
            <Text style={styles.leaveSub}>
              {isOnLeave ? 'No jobs will be assigned' : 'Tap to toggle leave/holiday status'}
            </Text>
          </View>
          <Ionicons
            name={isOnLeave ? 'checkmark-circle' : 'chevron-forward'}
            size={20}
            color={colors.white}
          />
        </Pressable>

        {/* Time Slot Availability Settings */}
        {!isOnLeave && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Available Slots for {selectedDay}</Text>
            <Text style={styles.cardSub}>Select the hours you are ready to take service orders</Text>

            <Pressable
              style={[styles.slotItem, slots.morning && styles.slotActive]}
              onPress={() => toggleSlot('morning')}
            >
              <View style={styles.slotLeft}>
                <Ionicons name="sunny-outline" size={20} color={colors.warning} />
                <View>
                  <Text style={styles.slotName}>Morning Shift</Text>
                  <Text style={styles.slotTime}>09:00 AM - 12:00 PM</Text>
                </View>
              </View>
              <Ionicons
                name={slots.morning ? 'checkbox' : 'square-outline'}
                size={22}
                color={slots.morning ? colors.purpleBright : colors.textMuted}
              />
            </Pressable>

            <Pressable
              style={[styles.slotItem, slots.afternoon && styles.slotActive]}
              onPress={() => toggleSlot('afternoon')}
            >
              <View style={styles.slotLeft}>
                <Ionicons name="time-outline" size={20} color={colors.info} />
                <View>
                  <Text style={styles.slotName}>Afternoon Shift</Text>
                  <Text style={styles.slotTime}>12:00 PM - 04:00 PM</Text>
                </View>
              </View>
              <Ionicons
                name={slots.afternoon ? 'checkbox' : 'square-outline'}
                size={22}
                color={slots.afternoon ? colors.purpleBright : colors.textMuted}
              />
            </Pressable>

            <Pressable
              style={[styles.slotItem, slots.evening && styles.slotActive]}
              onPress={() => toggleSlot('evening')}
            >
              <View style={styles.slotLeft}>
                <Ionicons name="moon-outline" size={20} color={colors.purpleBright} />
                <View>
                  <Text style={styles.slotName}>Evening Shift</Text>
                  <Text style={styles.slotTime}>04:00 PM - 08:00 PM</Text>
                </View>
              </View>
              <Ionicons
                name={slots.evening ? 'checkbox' : 'square-outline'}
                size={22}
                color={slots.evening ? colors.purpleBright : colors.textMuted}
              />
            </Pressable>
          </View>
        )}

        <Pressable style={styles.saveBtn} onPress={handleSaveSchedule}>
          <Text style={styles.saveBtnText}>Save Schedule Preferences</Text>
        </Pressable>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    padding: spacing.xl,
  },
  pageTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.lg,
  },
  dayRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  dayCard: {
    width: 60,
    height: 70,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    gap: 6,
  },
  dayCardActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purpleBright,
  },
  dayText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  dayTextActive: {
    color: colors.white,
  },
  dayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  leaveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  leaveBannerActive: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warning,
  },
  leaveTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  leaveSub: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.cardElevated,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  cardTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  cardSub: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  slotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  slotActive: {
    borderColor: colors.purple,
    backgroundColor: colors.purpleSoft,
  },
  slotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  slotName: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  slotTime: {
    color: colors.textMuted,
    fontSize: 11,
  },
  saveBtn: {
    backgroundColor: colors.purple,
    borderRadius: radius.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
