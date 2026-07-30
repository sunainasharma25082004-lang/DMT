import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme/colors';

const REVIEWS = [
  {
    id: 'rev1',
    customer: 'Aarav Sharma',
    city: 'Mumbai',
    rating: 5,
    date: '27 Jul 2026',
    comment: 'Ramesh bhai did an fantastic AC service! Cleaned all filters and checked gas pressure.',
  },
  {
    id: 'rev2',
    customer: 'Sunaina Sharma',
    city: 'Delhi NCR',
    rating: 5,
    date: '22 Jul 2026',
    comment: 'Very polite behavior and arrived exactly on time. Highly recommended!',
  },
];

export function ProfileScreen({ user, onSignOut }: { user: any; onSignOut: () => void }) {
  const insets = useSafeAreaInsets();
  const [upiId, setUpiId] = useState('rameshkumar@okaxis');
  const [bankAccount, setBankAccount] = useState('HDFC Bank - 50100492817291');

  const handleUpdateBank = () => {
    Alert.alert('Bank Details Saved 🏦', 'Payout account information updated successfully.');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar Header */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarGlow}>
            <Image
              source={{
                uri:
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80',
              }}
              style={styles.avatar}
              contentFit="cover"
            />
          </View>
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={14} color={colors.white} />
          </View>
        </View>

        <Text style={styles.name}>{user?.name || 'Ramesh Kumar'}</Text>
        <Text style={styles.phone}>{user?.phone || '+91 98765 12345'}</Text>

        <View style={styles.bgvPill}>
          <Text style={styles.bgvPillText}>VERIFIED TECHNICIAN • ID: PRO-101</Text>
        </View>

        {/* Skills Offered */}
        <Text style={styles.sectionTitle}>SKILLS & CATEGORIES OFFERED</Text>
        <View style={styles.skillsRow}>
          {['AC Repair', 'Window AC Service', 'Gas Refill', 'PCB Repair', 'Deep Cleaning'].map(
            (sk) => (
              <View key={sk} style={styles.skillChip}>
                <Ionicons name="construct" size={12} color={colors.purpleBright} />
                <Text style={styles.skillText}>{sk}</Text>
              </View>
            )
          )}
        </View>

        {/* Bank Account Details for Payout */}
        <Text style={styles.sectionTitle}>BANK & UPI PAYOUT DETAILS</Text>
        <View style={styles.card}>
          <Text style={styles.label}>UPI ID for Instant Payout</Text>
          <TextInput
            style={styles.input}
            value={upiId}
            onChangeText={setUpiId}
            placeholder="ramesh@okicici"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.label}>Bank Account</Text>
          <TextInput
            style={styles.input}
            value={bankAccount}
            onChangeText={setBankAccount}
            placeholder="Bank Name & Acc No."
            placeholderTextColor={colors.textMuted}
          />

          <Pressable style={styles.saveBankBtn} onPress={handleUpdateBank}>
            <Text style={styles.saveBankText}>Save Bank Account</Text>
          </Pressable>
        </View>

        {/* Ratings & Customer Reviews */}
        <Text style={styles.sectionTitle}>RATINGS & REVIEWS RECEIVED</Text>
        {REVIEWS.map((r) => (
          <View key={r.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View>
                <Text style={styles.customerName}>{r.customer}</Text>
                <Text style={styles.reviewDate}>
                  {r.city} • {r.date}
                </Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{r.rating} ⭐</Text>
              </View>
            </View>
            <Text style={styles.reviewComment}>"{r.comment}"</Text>
          </View>
        ))}

        {/* Sign Out Button */}
        <Pressable style={styles.signOutBtn} onPress={onSignOut}>
          <Text style={styles.signOutText}>Sign Out from Partner App</Text>
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
  avatarSection: {
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  avatarGlow: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    borderColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },
  verifiedBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bg,
  },
  name: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  phone: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
  },
  bgvPill: {
    alignSelf: 'center',
    backgroundColor: colors.purpleSoft,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginTop: 8,
    marginBottom: spacing.xl,
  },
  bgvPillText: {
    color: colors.purpleBright,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skillText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.cardElevated,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.white,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  saveBankBtn: {
    backgroundColor: colors.purple,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBankText: {
    color: colors.white,
    fontWeight: '800',
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  customerName: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  reviewDate: {
    color: colors.textMuted,
    fontSize: 11,
  },
  ratingBadge: {
    backgroundColor: colors.purpleSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  ratingText: {
    color: colors.star,
    fontWeight: '800',
    fontSize: 11,
  },
  reviewComment: {
    color: colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  signOutBtn: {
    borderWidth: 1.5,
    borderColor: colors.danger,
    borderRadius: radius.full,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  signOutText: {
    color: colors.danger,
    fontWeight: '800',
  },
});
