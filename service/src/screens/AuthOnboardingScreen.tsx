import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme/colors';

interface Props {
  onLoginSuccess: (user: any) => void;
}

export function AuthOnboardingScreen({ onLoginSuccess }: Props) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'otp' | 'idpass' | 'kyc'>('otp');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // KYC state
  const [aadhaarUploaded, setAadhaarUploaded] = useState(true);
  const [panUploaded, setPanUploaded] = useState(true);
  const [trainingDone, setTrainingDone] = useState(true);

  const handleSendWhatsAppOTP = () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Phone Required', 'Enter your registered 10-digit mobile number.');
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setOtp(code);
    setOtpSent(true);

    const waMsg = `DMT Partner Login OTP code: ${code}. Do not share with anyone.`;
    const url = `https://wa.me/91${phone.replace(/\D/g, '')}?text=${encodeURIComponent(waMsg)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('WhatsApp Sent', `OTP Sent to +91 ${phone}: ${code}`);
    });
  };

  const handleVerifyOTP = () => {
    if (otp.length >= 4) {
      onLoginSuccess({
        id: 'PRO-101',
        name: 'Ramesh Kumar',
        phone: `+91 ${phone}`,
        category: 'AC Repair & Service',
        bgvStatus: 'VERIFIED',
      });
    } else {
      Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP code.');
    }
  };

  const handleIdPassLogin = () => {
    if (!adminId || !adminPass) {
      Alert.alert('Error', 'Please enter both ID and Password provided by DMT Admin.');
      return;
    }
    onLoginSuccess({
      id: adminId,
      name: 'Verified Partner',
      phone: '+91 98765 12345',
      category: 'Multi-Skilled Technician',
      bgvStatus: 'VERIFIED',
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header Branding */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Ionicons name="construct" size={28} color={colors.purpleBright} />
          </View>
          <Text style={styles.appName}>DMT Partner App</Text>
          <Text style={styles.tagline}>Professional & Technician Portal</Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tabBtn, activeTab === 'otp' && styles.tabBtnActive]}
            onPress={() => setActiveTab('otp')}
          >
            <Text style={[styles.tabText, activeTab === 'otp' && styles.tabTextActive]}>
              WhatsApp OTP
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, activeTab === 'idpass' && styles.tabBtnActive]}
            onPress={() => setActiveTab('idpass')}
          >
            <Text style={[styles.tabText, activeTab === 'idpass' && styles.tabTextActive]}>
              ID / Password
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, activeTab === 'kyc' && styles.tabBtnActive]}
            onPress={() => setActiveTab('kyc')}
          >
            <Text style={[styles.tabText, activeTab === 'kyc' && styles.tabTextActive]}>
              KYC & Status
            </Text>
          </Pressable>
        </View>

        {/* TAB 1: WhatsApp OTP */}
        {activeTab === 'otp' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mobile Number Login</Text>
            <Text style={styles.cardSub}>Enter your phone number to receive OTP via WhatsApp</Text>

            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputRow}>
              <View style={styles.prefix}>
                <Text style={styles.prefixText}>+91</Text>
              </View>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="98765 12345"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {otpSent && (
              <>
                <Text style={styles.label}>4-Digit WhatsApp OTP</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP (Any 4 digits)"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                />
              </>
            )}

            {!otpSent ? (
              <Pressable style={styles.waLoginBtn} onPress={handleSendWhatsAppOTP}>
                <Ionicons name="logo-whatsapp" size={20} color={colors.white} />
                <Text style={styles.waLoginText}>Send OTP on WhatsApp</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.mainBtn} onPress={handleVerifyOTP}>
                <Text style={styles.mainBtnText}>Verify OTP & Login</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.white} />
              </Pressable>
            )}
          </View>
        )}

        {/* TAB 2: ID / Password */}
        {activeTab === 'idpass' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Admin Credentials Login</Text>
            <Text style={styles.cardSub}>
              Use the ID & Password issued by DMT Admin after application approval.
            </Text>

            <Text style={styles.label}>Technician Partner ID</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. PRO-101"
              placeholderTextColor={colors.textMuted}
              value={adminId}
              onChangeText={setAdminId}
              autoCapitalize="characters"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={true}
              value={adminPass}
              onChangeText={setAdminPass}
            />

            <Pressable style={styles.mainBtn} onPress={handleIdPassLogin}>
              <Text style={styles.mainBtnText}>Login to Dashboard</Text>
              <Ionicons name="lock-open-outline" size={18} color={colors.white} />
            </Pressable>
          </View>
        )}

        {/* TAB 3: KYC & Onboarding Status */}
        {activeTab === 'kyc' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Onboarding & BGV Status</Text>
            <Text style={styles.cardSub}>Verify your documents & mandatory training modules</Text>

            {/* BGV Badge */}
            <View style={styles.bgvBanner}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              <View style={{ flex: 1 }}>
                <Text style={styles.bgvTitle}>Background Verification: PASSED</Text>
                <Text style={styles.bgvSub}>Verified by Police & Third-party Auditor</Text>
              </View>
            </View>

            {/* Document Checklist */}
            <Text style={styles.sectionHeader}>KYC DOCUMENTS</Text>
            <View style={styles.docItem}>
              <Ionicons name="card" size={20} color={colors.purpleBright} />
              <View style={{ flex: 1 }}>
                <Text style={styles.docName}>Aadhaar Card (Front & Back)</Text>
                <Text style={styles.docStatus}>VERIFIED</Text>
              </View>
              <Ionicons name="checkmark-done" size={20} color={colors.success} />
            </View>

            <View style={styles.docItem}>
              <Ionicons name="document-text" size={20} color={colors.purpleBright} />
              <View style={{ flex: 1 }}>
                <Text style={styles.docName}>PAN Card</Text>
                <Text style={styles.docStatus}>VERIFIED</Text>
              </View>
              <Ionicons name="checkmark-done" size={20} color={colors.success} />
            </View>

            {/* Mandatory Training Module */}
            <Text style={styles.sectionHeader}>MANDATORY TRAINING MODULE</Text>
            <View style={styles.trainingCard}>
              <View style={styles.trainingHeader}>
                <Ionicons name="school" size={20} color={colors.purpleBright} />
                <Text style={styles.trainingTitle}>DMT Professional Safety & Etiquette</Text>
              </View>
              <Text style={styles.trainingText}>
                Learn how to interact with customers, use OTP verification, and follow safety standards.
              </Text>
              <Pressable
                style={[styles.trainingBtn, trainingDone && { backgroundColor: colors.success }]}
                onPress={() => {
                  setTrainingDone(true);
                  Alert.alert('Training Completed', 'You have completed 100% training module!');
                }}
              >
                <Text style={styles.trainingBtnText}>
                  {trainingDone ? 'Module Completed (100%)' : 'Start Video Training (15 mins)'}
                </Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.mainBtn}
              onPress={() =>
                onLoginSuccess({
                  id: 'PRO-101',
                  name: 'Ramesh Kumar',
                  phone: '+91 98765 12345',
                  category: 'AC Repair & Service',
                })
              }
            >
              <Text style={styles.mainBtnText}>Continue to Home Screen</Text>
            </Pressable>
          </View>
        )}
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
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.purple,
    marginBottom: spacing.md,
  },
  appName: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  tagline: {
    color: colors.purpleBright,
    fontSize: 13,
    marginTop: 4,
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
  card: {
    backgroundColor: colors.cardElevated,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  cardSub: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  prefix: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  prefixText: {
    color: colors.white,
    fontWeight: '700',
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
  waLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25D366',
    borderRadius: radius.full,
    paddingVertical: 14,
    marginTop: spacing.md,
  },
  waLoginText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  mainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.purple,
    borderRadius: radius.full,
    paddingVertical: 14,
    marginTop: spacing.md,
  },
  mainBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  bgvBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.successSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.success,
    marginBottom: spacing.lg,
  },
  bgvTitle: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '800',
  },
  bgvSub: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  sectionHeader: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  docName: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  docStatus: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '800',
  },
  trainingCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  trainingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 6,
  },
  trainingTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  trainingText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: spacing.md,
  },
  trainingBtn: {
    backgroundColor: colors.purple,
    borderRadius: radius.full,
    paddingVertical: 10,
    alignItems: 'center',
  },
  trainingBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
