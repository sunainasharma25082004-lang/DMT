import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme/colors';

const PAYOUT_HISTORY = [
  { id: 'tx1', date: '28 Jul 2026', amount: 14200, status: 'PAID', bank: 'HDFC Bank (**** 4891)' },
  { id: 'tx2', date: '21 Jul 2026', amount: 18500, status: 'PAID', bank: 'HDFC Bank (**** 4891)' },
  { id: 'tx3', date: '14 Jul 2026', amount: 16900, status: 'PAID', bank: 'HDFC Bank (**** 4891)' },
];

export function EarningsScreen() {
  const insets = useSafeAreaInsets();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const handleRequestPayout = () => {
    Alert.alert(
      'Instant Payout Requested 💳',
      '₹3,450 will be credited to your linked HDFC Bank Account (rameshkumar@okaxis) within 15 minutes.'
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Earnings & Payouts</Text>

        {/* Timeframe Switcher */}
        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tabBtn, timeframe === 'daily' && styles.tabBtnActive]}
            onPress={() => setTimeframe('daily')}
          >
            <Text style={[styles.tabText, timeframe === 'daily' && styles.tabTextActive]}>
              Today
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, timeframe === 'weekly' && styles.tabBtnActive]}
            onPress={() => setTimeframe('weekly')}
          >
            <Text style={[styles.tabText, timeframe === 'weekly' && styles.tabTextActive]}>
              This Week
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, timeframe === 'monthly' && styles.tabBtnActive]}
            onPress={() => setTimeframe('monthly')}
          >
            <Text style={[styles.tabText, timeframe === 'monthly' && styles.tabTextActive]}>
              This Month
            </Text>
          </Pressable>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>TOTAL EARNINGS ({timeframe.toUpperCase()})</Text>
          <Text style={styles.heroAmount}>
            {timeframe === 'daily' ? '₹3,450' : timeframe === 'weekly' ? '₹22,850' : '₹84,200'}
          </Text>

          <View style={styles.payoutStatusRow}>
            <View>
              <Text style={styles.pendingLabel}>Pending Transfer</Text>
              <Text style={styles.pendingVal}>₹3,450 (Ready)</Text>
            </View>
            <Pressable style={styles.payoutBtn} onPress={handleRequestPayout}>
              <Ionicons name="flash" size={16} color={colors.white} />
              <Text style={styles.payoutBtnText}>Instant Payout</Text>
            </Pressable>
          </View>
        </View>

        {/* Bonus & Incentives Tracker */}
        <Text style={styles.sectionTitle}>ACTIVE INCENTIVES & BONUSES</Text>
        <View style={styles.incentiveCard}>
          <View style={styles.incHeader}>
            <Ionicons name="trophy" size={22} color={colors.warning} />
            <Text style={styles.incTitle}>Daily Power Bonus: Extra ₹500</Text>
          </View>
          <Text style={styles.incSub}>Complete 5 jobs today to unlock bonus. (3/5 done)</Text>

          {/* Progress Bar */}
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
          <Text style={styles.progressText}>2 more jobs needed before 10:00 PM</Text>
        </View>

        {/* Payout History */}
        <Text style={styles.sectionTitle}>PAYOUT HISTORY</Text>
        {PAYOUT_HISTORY.map((tx) => (
          <View key={tx.id} style={styles.txItem}>
            <View style={styles.txIcon}>
              <Ionicons name="arrow-down-circle" size={22} color={colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.txAmount}>+ ₹{tx.amount.toLocaleString('en-IN')}</Text>
              <Text style={styles.txBank}>{tx.bank}</Text>
              <Text style={styles.txDate}>{tx.date}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>SUCCESS</Text>
            </View>
          </View>
        ))}

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
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.full,
    padding: 4,
    marginBottom: spacing.xl,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radius.full,
  },
  tabBtnActive: {
    backgroundColor: colors.purple,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  tabTextActive: {
    color: colors.white,
  },
  heroCard: {
    backgroundColor: colors.cardElevated,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.purple,
    marginBottom: spacing.xl,
  },
  heroLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
  },
  heroAmount: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '900',
    marginVertical: spacing.xs,
  },
  payoutStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginTop: spacing.md,
  },
  pendingLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  pendingVal: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '800',
  },
  payoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.purple,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  payoutBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  incentiveCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  incHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  incTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  incSub: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  progressBg: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.purpleBright,
  },
  progressText: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '700',
  },
  txItem: {
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
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txAmount: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  txBank: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  txDate: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: colors.successSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  statusText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '800',
  },
});
