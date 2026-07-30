import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme/colors';

const FAQS = [
  {
    q: 'When do I get my weekly payout?',
    a: 'Weekly payouts are processed automatically every Tuesday directly into your linked bank account or UPI ID.',
  },
  {
    q: 'What is DMT platform commission fee?',
    a: 'DMT charges a standard 15% platform fee on completed jobs. Active bonus incentives can cover up to 100% of commission!',
  },
  {
    q: 'What happens if a customer cancels at the last minute?',
    a: 'If a customer cancels within 30 minutes of scheduled time after you reached location, you receive a ₹200 cancellation compensation fee.',
  },
];

export function SupportScreen() {
  const insets = useSafeAreaInsets();
  const [subject, setSubject] = useState('');
  const [issue, setIssue] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'agent', text: 'Hello Ramesh! I am Vikram from DMT Support. How can I help you today?' },
  ]);
  const [msgInput, setMsgInput] = useState('');

  const handleRaiseTicket = () => {
    if (!subject || !issue) {
      Alert.alert('Fields Required', 'Please enter subject and issue description.');
      return;
    }
    Alert.alert(
      'Support Ticket Raised 🎫',
      'Ticket #TKT-9934 generated. Support team will contact you on WhatsApp within 15 minutes.'
    );
    setSubject('');
    setIssue('');
  };

  const handleSendChatMessage = () => {
    if (!msgInput.trim()) return;
    const userMsg = { id: Date.now().toString(), sender: 'user', text: msgInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setMsgInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: 'Thanks for contacting us. I have updated your request in our admin system.',
        },
      ]);
    }, 1000);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Support & Partner Help</Text>

        {/* Live Chat Banner */}
        <Pressable style={styles.chatBanner} onPress={() => setChatOpen(!chatOpen)}>
          <Ionicons name="chatbubbles" size={24} color={colors.purpleBright} />
          <View style={{ flex: 1 }}>
            <Text style={styles.chatBannerTitle}>Live Chat with DMT Agent</Text>
            <Text style={styles.chatBannerSub}>Average response time: &lt; 2 minutes</Text>
          </View>
          <Ionicons name={chatOpen ? 'chevron-up' : 'chevron-down'} size={20} color={colors.white} />
        </Pressable>

        {/* Live Chat Container */}
        {chatOpen && (
          <View style={styles.chatContainer}>
            <ScrollView style={styles.chatBox} showsVerticalScrollIndicator={false}>
              {chatMessages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.msgBubble,
                    msg.sender === 'user' ? styles.userBubble : styles.agentBubble,
                  ]}
                >
                  <Text style={styles.msgText}>{msg.text}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder="Type your message..."
                placeholderTextColor={colors.textMuted}
                value={msgInput}
                onChangeText={setMsgInput}
              />
              <Pressable style={styles.sendBtn} onPress={handleSendChatMessage}>
                <Ionicons name="send" size={16} color={colors.white} />
              </Pressable>
            </View>
          </View>
        )}

        {/* Raise Ticket Form */}
        <Text style={styles.sectionTitle}>RAISE A SUPPORT TICKET</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Payment delay / Customer issue"
            placeholderTextColor={colors.textMuted}
            value={subject}
            onChangeText={setSubject}
          />

          <Text style={styles.label}>Issue Details</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            placeholder="Describe your issue in detail..."
            placeholderTextColor={colors.textMuted}
            value={issue}
            onChangeText={setIssue}
          />

          <Pressable style={styles.ticketBtn} onPress={handleRaiseTicket}>
            <Ionicons name="paper-plane" size={16} color={colors.white} />
            <Text style={styles.ticketBtnText}>Submit Support Ticket</Text>
          </Pressable>
        </View>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>PARTNER FREQUENTLY ASKED QUESTIONS</Text>
        {FAQS.map((faq, idx) => (
          <View key={idx} style={styles.faqCard}>
            <Text style={styles.faqQ}>Q: {faq.q}</Text>
            <Text style={styles.faqA}>{faq.a}</Text>
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
  chatBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.purpleSoft,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.purple,
    marginBottom: spacing.xl,
  },
  chatBannerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  chatBannerSub: {
    color: colors.purpleBright,
    fontSize: 12,
    marginTop: 2,
  },
  chatContainer: {
    backgroundColor: colors.cardElevated,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  chatBox: {
    maxHeight: 180,
    marginBottom: spacing.md,
  },
  msgBubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
  },
  agentBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.purple,
  },
  msgText: {
    color: colors.white,
    fontSize: 13,
  },
  chatInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chatInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: colors.white,
    fontSize: 13,
  },
  sendBtn: {
    backgroundColor: colors.purple,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
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
  ticketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.purple,
    borderRadius: radius.full,
    paddingVertical: 12,
    marginTop: spacing.sm,
  },
  ticketBtnText: {
    color: colors.white,
    fontWeight: '800',
  },
  faqCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  faqQ: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  faqA: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});
