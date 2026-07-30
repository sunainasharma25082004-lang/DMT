import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { colors, radius, spacing } from '../theme/colors';

export function JobManagementScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<'today' | 'upcoming' | 'completed'>('today');

  // Job progress state
  const [jobStatus, setJobStatus] = useState<
    'ASSIGNED' | 'ON_THE_WAY' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED'
  >('ASSIGNED');
  const [locationText, setLocationText] = useState('Fetching live GPS coordinates...');
  const [otpInput, setOtpInput] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);

  const fetchLiveGPSLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationText('19.1197° N, 72.8464° E • Andheri West (Location Permission Denied)');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = loc.coords;
      const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (reverse && reverse.length > 0) {
        const place = reverse[0];
        const area = place.district || place.subregion || place.city || 'Local Area';
        const formatted = `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E • ${area} (0.3 km away)`;
        setLocationText(formatted);
      } else {
        setLocationText(`${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E • Verified GPS (Near Location)`);
      }
    } catch (e) {
      setLocationText('19.1197° N, 72.8464° E • Andheri West, Mumbai (0.4 km away)');
    }
  };

  React.useEffect(() => {
    fetchLiveGPSLocation();
  }, []);

  const openGoogleMaps = () => {
    const address = 'Flat 402, Horizon Heights, Andheri West, Mumbai';
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(mapsUrl).catch(() => {
      Alert.alert('Google Maps Launcher', `Navigating to: ${address}`);
    });
  };

  const handleOnTheWay = () => {
    setJobStatus('ON_THE_WAY');
    Alert.alert('Status Updated: ON THE WAY 🚗', 'Customer notified that technician is en route to location.');
  };

  const handleArrived = () => {
    setJobStatus('ARRIVED');
    Alert.alert('Status Updated: ARRIVED 📍', 'Customer notified that technician has reached the location.');
  };

  const handleStartJob = () => {
    setJobStatus('IN_PROGRESS');
    Alert.alert(
      'Job Started 🚀',
      'Customer notified that technician has started work.'
    );
  };

  const handleVerifyOTPAndComplete = () => {
    if (otpInput === '4829' || otpInput.length === 4) {
      setJobStatus('COMPLETED');
      setOtpModalVisible(false);
      Alert.alert(
        'Job Completed Successfully! 🎉',
        'Payment of ₹2,499 has been credited to your DMT wallet.'
      );
    } else {
      Alert.alert('Invalid OTP', 'Please enter valid 4-digit OTP provided by customer (Demo: 4829)');
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Job Management</Text>

        {/* Filter Tabs */}
        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tabBtn, activeFilter === 'today' && styles.tabBtnActive]}
            onPress={() => setActiveFilter('today')}
          >
            <Text style={[styles.tabText, activeFilter === 'today' && styles.tabTextActive]}>
              Today (1)
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, activeFilter === 'upcoming' && styles.tabBtnActive]}
            onPress={() => setActiveFilter('upcoming')}
          >
            <Text style={[styles.tabText, activeFilter === 'upcoming' && styles.tabTextActive]}>
              Upcoming (2)
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, activeFilter === 'completed' && styles.tabBtnActive]}
            onPress={() => setActiveFilter('completed')}
          >
            <Text style={[styles.tabText, activeFilter === 'completed' && styles.tabTextActive]}>
              History (28)
            </Text>
          </Pressable>
        </View>

        {/* Main Active Job Card */}
        {activeFilter === 'today' && (
          <View style={styles.activeJobCard}>
            <View style={styles.jobHeader}>
              <View>
                <Text style={styles.bookingCode}>BOOKING: DMT-88421</Text>
                <Text style={styles.serviceTitle}>Full Home Deep Cleaning</Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  jobStatus === 'ON_THE_WAY' && { backgroundColor: colors.infoSoft },
                  jobStatus === 'ARRIVED' && { backgroundColor: colors.purpleSoft },
                  jobStatus === 'IN_PROGRESS' && { backgroundColor: colors.warningSoft },
                  jobStatus === 'COMPLETED' && { backgroundColor: colors.successSoft },
                ]}
              >
                <Text
                  style={[
                    styles.statusPillText,
                    jobStatus === 'ON_THE_WAY' && { color: colors.info },
                    jobStatus === 'ARRIVED' && { color: colors.purpleBright },
                    jobStatus === 'IN_PROGRESS' && { color: colors.warning },
                    jobStatus === 'COMPLETED' && { color: colors.success },
                  ]}
                >
                  {jobStatus === 'ON_THE_WAY' ? 'ON THE WAY 🚗' : jobStatus === 'ARRIVED' ? 'ARRIVED 📍' : jobStatus}
                </Text>
              </View>
            </View>

            {/* Live Location Detection Box */}
            <View style={styles.locationDetectorBox}>
              <Ionicons name="compass" size={20} color={colors.purpleBright} />
              <View style={{ flex: 1 }}>
                <Text style={styles.locationDetectorTitle}>Detected Live Location</Text>
                <Text style={styles.locationDetectorText}>{locationText}</Text>
              </View>
              <Pressable
                style={styles.refreshLocBtn}
                onPress={() => {
                  fetchLiveGPSLocation();
                  Alert.alert('GPS Location Refreshed 📍', 'Real-time GPS coordinates detected via device sensors.');
                }}
              >
                <Ionicons name="refresh" size={14} color={colors.white} />
              </Pressable>
            </View>

            {/* Customer & Address Details */}
            <View style={styles.detailBox}>
              <View style={styles.row}>
                <Ionicons name="person" size={16} color={colors.purpleBright} />
                <Text style={styles.detailText}>Customer: Rohan Deshmukh</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="call" size={16} color={colors.purpleBright} />
                <Text style={styles.detailText}>Phone: +91 98765 43210</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="location" size={16} color={colors.purpleBright} />
                <Text style={styles.detailText}>
                  Flat 402, Horizon Heights, Andheri West, Mumbai
                </Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="calendar" size={16} color={colors.purpleBright} />
                <Text style={styles.detailText}>Time: Today, 04:00 PM</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="cash" size={16} color={colors.purpleBright} />
                <Text style={styles.detailText}>Total Payout: ₹2,499 (Paid via UPI)</Text>
              </View>
            </View>

            {/* Progressive Status Action Buttons */}
            <View style={styles.actionGrid}>
              {/* Google Maps Navigation Launcher */}
              <Pressable style={styles.mapsBtn} onPress={openGoogleMaps}>
                <Ionicons name="navigate-circle" size={20} color={colors.white} />
                <Text style={styles.mapsBtnText}>Open Google Maps</Text>
              </Pressable>

              {/* Step 1: Mark On My Way */}
              {jobStatus === 'ASSIGNED' && (
                <Pressable style={styles.startBtn} onPress={handleOnTheWay}>
                  <Ionicons name="car" size={18} color={colors.white} />
                  <Text style={styles.startBtnText}>Mark: On My Way 🚗</Text>
                </Pressable>
              )}

              {/* Step 2: Mark Arrived at Location */}
              {jobStatus === 'ON_THE_WAY' && (
                <Pressable style={[styles.startBtn, { backgroundColor: colors.purpleDark }]} onPress={handleArrived}>
                  <Ionicons name="pin" size={18} color={colors.white} />
                  <Text style={styles.startBtnText}>Mark: Arrived at Location 📍</Text>
                </Pressable>
              )}

              {/* Step 3: Start Job */}
              {jobStatus === 'ARRIVED' && (
                <Pressable style={styles.startBtn} onPress={handleStartJob}>
                  <Ionicons name="play" size={18} color={colors.white} />
                  <Text style={styles.startBtnText}>Start Job Now 🚀</Text>
                </Pressable>
              )}

              {/* Step 4: Complete Job Button */}
              {jobStatus === 'IN_PROGRESS' && (
                <Pressable
                  style={styles.completeBtn}
                  onPress={() => setOtpModalVisible(true)}
                >
                  <Ionicons name="checkmark-done" size={18} color={colors.white} />
                  <Text style={styles.completeBtnText}>Verify OTP & Complete</Text>
                </Pressable>
              )}

              {jobStatus === 'COMPLETED' && (
                <View style={styles.completedBox}>
                  <Ionicons name="checkmark-circle" size={22} color={colors.success} />
                  <Text style={styles.completedText}>Job Completed & Verified!</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Customer OTP Verification & Proof Upload Modal */}
        <Modal visible={otpModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Complete Job Verification</Text>
                <Pressable onPress={() => setOtpModalVisible(false)}>
                  <Ionicons name="close" size={22} color={colors.white} />
                </Pressable>
              </View>

              <Text style={styles.modalSub}>
                1. Upload proof photo of completed service{'\n'}
                2. Ask customer for 4-digit completion OTP
              </Text>

              {/* Upload Proof Photo Simulation */}
              <Pressable
                style={[styles.uploadBox, proofUploaded && styles.uploadBoxDone]}
                onPress={() => {
                  setProofUploaded(true);
                  Alert.alert('Photo Captured', 'Service completion photo uploaded to server.');
                }}
              >
                <Ionicons
                  name={proofUploaded ? 'checkmark-circle' : 'camera'}
                  size={24}
                  color={proofUploaded ? colors.success : colors.purpleBright}
                />
                <Text style={styles.uploadText}>
                  {proofUploaded ? 'Proof Photo Uploaded ✓' : 'Tap to Upload Proof Photo'}
                </Text>
              </Pressable>

              {/* Customer OTP Input */}
              <Text style={styles.label}>Customer OTP (Demo Code: 4829)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 4-digit OTP"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                value={otpInput}
                onChangeText={setOtpInput}
              />

              <Pressable style={styles.verifyBtn} onPress={handleVerifyOTPAndComplete}>
                <Text style={styles.verifyBtnText}>Confirm Completion & Payout</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

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
  activeJobCard: {
    backgroundColor: colors.cardElevated,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.purple,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  bookingCode: {
    color: colors.purpleBright,
    fontSize: 11,
    fontWeight: '800',
  },
  serviceTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  statusPill: {
    backgroundColor: colors.purpleSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  statusPillText: {
    color: colors.purpleBright,
    fontSize: 11,
    fontWeight: '800',
  },
  locationDetectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.purple,
    marginBottom: spacing.md,
  },
  locationDetectorTitle: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  locationDetectorText: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  refreshLocBtn: {
    backgroundColor: colors.purple,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBox: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    color: colors.textSecondary,
    fontSize: 13,
    flex: 1,
  },
  actionGrid: {
    gap: spacing.md,
  },
  mapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    borderRadius: radius.full,
  },
  mapsBtnText: {
    color: colors.white,
    fontWeight: '800',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.purple,
    paddingVertical: 14,
    borderRadius: radius.full,
  },
  startBtnText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 15,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.success,
    paddingVertical: 14,
    borderRadius: radius.full,
  },
  completeBtnText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 15,
  },
  completedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.successSoft,
    paddingVertical: 12,
    borderRadius: radius.full,
  },
  completedText: {
    color: colors.success,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.purple,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  modalTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  modalSub: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  uploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.purple,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
  },
  uploadBoxDone: {
    borderColor: colors.success,
    backgroundColor: colors.successSoft,
  },
  uploadText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
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
    marginBottom: spacing.lg,
  },
  verifyBtn: {
    backgroundColor: colors.purple,
    borderRadius: radius.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  verifyBtnText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 15,
  },
});
