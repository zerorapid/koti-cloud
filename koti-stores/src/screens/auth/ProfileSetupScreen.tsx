import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, Typography, Radii, Shadows } from '../../theme';

export default function ProfileSetupScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Koti!</Text>
          <Text style={styles.subtitle}>Help us know you better for a faster checkout experience.</Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputRow}>
                <User size={18} color={Colors.primary} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="John Doe"
                  autoFocus
                />
              </View>
            </View>

            <View style={[styles.field, { marginTop: Spacing.lg }]}>
              <Text style={styles.label}>Email Address (Optional)</Text>
              <View style={styles.inputRow}>
                <Mail size={18} color={Colors.primary} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="john@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.finishBtn, !name.trim() && styles.finishBtnDisabled]}
            disabled={!name.trim()}
            onPress={() => navigation.replace('MainApp')}
          >
            <Text style={styles.finishBtnText}>Start Shopping</Text>
            <ChevronRight size={20} color={Colors.surface} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  content: { flex: 1, padding: Spacing.xl, paddingTop: 40 },
  title: { ...Typography.display, fontSize: 28, marginBottom: Spacing.xs },
  subtitle: { ...Typography.body, color: Colors.textSecondary, marginBottom: 40 },

  form: { width: '100%' },
  field: { gap: 8 },
  label: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '700' },
  inputRow: { 
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surfaceGray, padding: Spacing.md,
    borderRadius: Radii.md, borderBottomWidth: 2, borderBottomColor: 'transparent'
  },
  input: { flex: 1, ...Typography.body, color: Colors.text },

  finishBtn: { 
    width: '100%', backgroundColor: Colors.primary, flexDirection: 'row', 
    alignItems: 'center', justifyContent: 'center', padding: Spacing.md, 
    borderRadius: Radii.md, marginTop: 40, gap: Spacing.xs,
    ...Shadows.md
  },
  finishBtnDisabled: { backgroundColor: Colors.border },
  finishBtnText: { color: Colors.surface, fontWeight: '700', fontSize: 16 },
});
