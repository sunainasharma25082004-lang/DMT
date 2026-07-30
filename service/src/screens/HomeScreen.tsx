import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme/colors';

interface Props {
  user: any;
  onNavigateToJob: () => void;
}

export function HomeScreen({ user, onNavigateToJob }: Props) {
  const insets = useSafeAreaInsets();
  const [isOnline, setIsOnline] = useState(true);
  const [showIncomingJob, setShowIncomingJob] = useState(true);
  const [countdown, setCountdown] = useState(25);

  const toggleOnline = () => {
    setIsOnline((prev) => !prev);
    Alert.alert(
      !isOnline ? 'You are ONLINE' : 'You are OFFLINE',
      !isOnline
        ? 'You will now receive new job requests nearby.'
        : 'You will not receive new requests while offline.'
    );
  };

  const handleAcceptJob = () => {
    setShowIncomingJob(false);
    Alert.alert('Job Accepted! 🎉', 'Navigate to customer location on Google Maps to start job.', [
      { text: 'Go to Job', onPress: onNavigateToJob },
    ]);
  };

  const handleRejectJob = () => {
    setShowIncomingJob(false);
    Alert.alert('Job Rejected', 'Request passed to another nearby technician.');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header with Technician Info & Online Toggle */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back 👋</Text>
            <Text style={styles.proName}>{user?.name || 'Ramesh Kumar'}</Text>
            <Text style={styles.proSkill}>{user?.category || 'AC Repair Specialist'}</Text>
          </View>
          {/* Online Toggle */}
          <View style={[styles.statusToggle, isOnline && styles.statusToggleOnline]}>
            <View style={[styles.statusDot, isOnline ? styles.dotGreen : styles.dotGray]} />
            <Text style={styles.statusText}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
            <Switch
              value={isOnline}
              onValueChange={toggleOnline}
              trackColor={{ false: '#333', true: colors.purpleDark }}
              thumbColor={isOnline ? colors.purpleBright : '#777'}
            />
          </View>
        </View>

        {/* Today's Earnings & Jobs Overview Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View>
              <Text style={styles.heroLabel}>TODAY'S EARNINGS</Text>
              <Text style={styles.heroAmount}>₹3,450</Text>
              <Text style={styles.heroSub}>+₹450 bonus earned today</Text>
            </View>
            <View style={styles.jobBadge}>
              <Text style={styles.jobBadgeCount}>2</Text>
              <Text style={styles.jobBadgeLabel}>Jobs Today</Text>
            </View>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroStats}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Completed</Text>
              <Text style={styles.statVal}>3 Jobs</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Avg Payout</Text>
              <Text style={styles.statVal}>₹1,150/job</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Rating</Text>
              <Text style={styles.statVal}>4.9 ⭐</Text>
            </View>
          </View>
        </View>

        {/* Incoming Job Notification Alert (Simulated Real-time push) */}
        {showIncomingJob && isOnline && (
          <View style={styles.requestCard}>
            <View style={styles.reqHeader}>
              <View style={styles.reqTag}>
                <Ionicons name="flash" size={14} color={colors.warning} />
                <Text style={styles.reqTagText}>NEW JOB REQUEST ({countdown}s)</Text>
              </View>
              <Text style={styles.reqPrice}>₹2,499</Text>
            </View>

            <Text style={styles.reqServiceTitle}>Full Home Deep Cleaning</Text>

            <View style={styles.reqDetailRow}>
              <Ionicons name="location-outline" size={16} color={colors.purpleBright} />
              <Text style={styles.reqDetailText}>
                Flat 402, Horizon Heights, Andheri West (2.4 km away)
              </Text>
            </View>

            <View style={styles.reqDetailRow}>
              <Ionicons name="time-outline" size={16} color={colors.purpleBright} />
              <Text style={styles.reqDetailText}>Today, 04:00 PM (4-5 hrs duration)</Text>
            </View>

            <View style={styles.reqDetailRow}>
              <Ionicons name="person-outline" size={16} color={colors.purpleBright} />
              <Text style={styles.reqDetailText}>Customer: Rohan Deshmukh (+91 98765 43210)</Text>
            </View>

            <View style={styles.reqActions}>
              <Pressable style={styles.rejectBtn} onPress={handleRejectJob}>
                <Text style={styles.rejectText}>Decline</Text>
              </Pressable>
              <Pressable style={styles.acceptBtn} onPress={handleAcceptJob}>
                <Text style={styles.acceptText}>Accept Job Now</Text>
                <Ionicons name="checkmark-circle" size={18} color={colors.white} />
              </Pressable>
            </View>
          </View>
        )}

        {/* Quick Stats Grid */}
        <Text style={styles.sectionTitle}>PERFORMANCE STATS</Text>
        <View style={styles.statsGrid}>
          <View style={styles.gridCard}>
            <View style={styles.gridIconGlow}>
              <Ionicons name="star" size={20} color={colors.star} />
            </View>
            <Text style={styles.gridVal}>4.9 / 5.0</Text>
            <Text style={styles.gridLabel}>Overall Rating</Text>
          </View>
          <View style={styles.gridCard}>
            <View style={styles.gridIconGlow}>
              <Ionicons name="checkmark-done-circle" size={20} color={colors.success} />
            </View>
            <Text style={styles.gridVal}>142</Text>
            <Text style={styles.gridLabel}>Completed Jobs</Text>
          </View>
          <View style={styles.gridCard}>
            <View style={styles.gridIconGlow}>
              <Ionicons name="time" size={20} color={colors.info} />
            </View>
            <Text style={styles.gridVal}>99.2%</Text>
            <Text style={styles.gridLabel}>On-Time Arrival</Text>
          </View>
          <View style={styles.gridCard}>
            <View style={styles.gridIconGlow}>
              <Ionicons name="cash" size={20} color={colors.purpleBright} />
            </View>
            <Text style={styles.gridVal}>₹84,200</Text>
            <Text style={styles.gridLabel}>Total Earned</Text>
          </View>
        </View>

        {/* Upcoming Assigned Jobs Preview */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>TODAY'S SCHEDULE</Text>
          <Pressable onPress={onNavigateToJob}>
            <Text style={styles.seeAll}>Manage Jobs →</Text>
          </Pressable>
        </View>

        <View style={styles.jobItem}>
          <View style={styles.jobItemIcon}>
            <Ionicons name="construct-outline" size={22} color={colors.purpleBright} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.jobItemTitle}>AC Repair & Gas Refill</Text>
            <Text style={styles.jobItemSub}>B-12, Green Park Extension, New Delhi</Text>
            <Text style={styles.jobItemTime}>Scheduled: 06:30 PM</Text>
          </View>
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>₹499</Text>
          </View>
        </View>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  welcomeText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  proName: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  proSkill: {
    color: colors.purpleBright,
    fontSize: 12,
    fontWeight: '600',
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusToggleOnline: {
    borderColor: colors.purple,
    backgroundColor: colors.purpleSoft,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotGreen: {
    backgroundColor: colors.success,
  },
  dotGray: {
    backgroundColor: colors.textMuted,
  },
  statusText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  heroCard: {
    backgroundColor: colors.cardElevated,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.purple,
    marginBottom: spacing.xl,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroAmount: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 2,
  },
  heroSub: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  jobBadge: {
    backgroundColor: colors.purple,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  jobBadgeCount: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
  },
  jobBadgeLabel: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  heroDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCol: {
    alignItems: 'flex-start',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  statVal: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  requestCard: {
    backgroundColor: '#1E142B',
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 2,
    borderColor: colors.purpleBright,
    marginBottom: spacing.xl,
  },
  reqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reqTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  reqTagText: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '800',
  },
  reqPrice: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
  },
  reqServiceTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  reqDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 6,
  },
  reqDetailText: {
    color: colors.textSecondary,
    fontSize: 13,
    flex: 1,
  },
  reqActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: colors.cardHover,
    paddingVertical: 12,
    borderRadius: radius.full,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  rejectText: {
    color: colors.danger,
    fontWeight: '700',
  },
  acceptBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.purple,
    paddingVertical: 12,
    borderRadius: radius.full,
  },
  acceptText: {
    color: colors.white,
    fontWeight: '800',
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  gridCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gridIconGlow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  gridVal: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  gridLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAll: {
    color: colors.purpleBright,
    fontSize: 12,
    fontWeight: '700',
  },
  jobItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  jobItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobItemTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  jobItemSub: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  jobItemTime: {
    color: colors.purpleBright,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  priceBadge: {
    backgroundColor: colors.cardHover,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  priceText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 13,
  },
});
