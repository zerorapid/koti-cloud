import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  Image, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Send, Phone, Info } from 'lucide-react-native';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';

const MOCK_MESSAGES = [
  { id: 1, text: 'Hi Jayapal! I am Koti, your virtual assistant. How can I help you today?', sender: 'support', time: '10:00 AM' },
];

export default function SupportChatScreen({ navigation, route }: any) {
  const { subject } = route.params || { subject: 'General Support' };
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Mock auto-reply
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        text: 'Our team is looking into your request. We will get back to you in 2-3 minutes.',
        sender: 'support',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.supportAvatar}>
            <Text style={styles.avatarText}>K</Text>
          </View>
          <View>
            <Text style={styles.supportName}>Koti Support</Text>
            <Text style={styles.supportStatus}>Online • {subject}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.actionBtn}>
          <Phone size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.chatList}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateLabel}>
          <Text style={styles.dateText}>TODAY</Text>
        </View>

        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === 'user' ? styles.userBubble : styles.supportBubble
            ]}
          >
            <Text style={[
              styles.messageText,
              msg.sender === 'user' ? styles.userText : styles.supportText
            ]}>
              {msg.text}
            </Text>
            <Text style={[
              styles.messageTime,
              msg.sender === 'user' ? styles.userTime : styles.supportTime
            ]}>
              {msg.time}
            </Text>
          </View>
        ))}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#fff',
  },
  backBtn: { padding: 4, marginRight: 12 },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  supportAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center'
  },
  avatarText: { color: Colors.primary, fontWeight: '800', fontSize: 18 },
  supportName: { fontSize: 16, fontWeight: '800', color: Colors.text },
  supportStatus: { fontSize: 12, color: Colors.success, fontWeight: '600' },
  actionBtn: { padding: 8 },

  chatList: { flex: 1, backgroundColor: '#F9FAFB' },
  chatContent: { padding: 16, paddingBottom: 32 },

  dateLabel: { alignItems: 'center', marginVertical: 20 },
  dateText: { fontSize: 11, fontWeight: '800', color: Colors.textTertiary, letterSpacing: 1 },

  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 16,
    ...Shadows.sm,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  supportBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: { fontSize: 15, lineHeight: 20 },
  userText: { color: '#fff', fontWeight: '500' },
  supportText: { color: Colors.text },
  messageTime: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  userTime: { color: 'rgba(255,255,255,0.7)' },
  supportTime: { color: Colors.textTertiary },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    color: Colors.text,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    ...Shadows.md,
  },
  sendBtnDisabled: { opacity: 0.5 },
});
