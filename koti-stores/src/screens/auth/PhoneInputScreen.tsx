import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, Typography, Radii, Shadows } from '../../theme';

export default function PhoneInputScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.content}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3724/3724720.png' }} 
            style={styles.logo} 
          />
          <Text style={styles.title}>Koti Stores</Text>
          <Text style={styles.subtitle}>Freshness delivered in 30 minutes</Text>

          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Enter your phone number</Text>
            <View style={styles.inputRow}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="00000 00000"
                keyboardType="phone-pad"
                maxLength={10}
                autoFocus
              />
            </View>
            <Text style={styles.hint}>We will send a 4-digit code for verification</Text>
          </View>

          <TouchableOpacity 
            style={[styles.nextBtn, phone.length < 10 && styles.nextBtnDisabled]}
            disabled={phone.length < 10}
            onPress={() => navigation.navigate('OTPVerify', { phone })}
          >
            <Text style={styles.nextBtnText}>Get OTP</Text>
            <ChevronRight size={20} color={Colors.surface} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.replace('MainApp')}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  content: { flex: 1, padding: Spacing.xl, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 100, height: 100, marginBottom: Spacing.md },
  title: { ...Typography.display, color: Colors.primary },
  subtitle: { ...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.xl },

  inputCard: { width: '100%', backgroundColor: Colors.surfaceGray, padding: Spacing.lg, borderRadius: Radii.lg },
  inputLabel: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.sm },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: Colors.primary, paddingBottom: 8 },
  countryCode: { ...Typography.h3, marginRight: 10 },
  input: { flex: 1, ...Typography.h3, color: Colors.text },
  hint: { ...Typography.caption, color: Colors.textTertiary, marginTop: Spacing.sm },

  nextBtn: { 
    width: '100%', backgroundColor: Colors.primary, flexDirection: 'row', 
    alignItems: 'center', justifyContent: 'center', padding: Spacing.md, 
    borderRadius: Radii.md, marginTop: Spacing.xl, gap: Spacing.xs
  },
  nextBtnDisabled: { backgroundColor: Colors.border },
  nextBtnText: { color: Colors.surface, fontWeight: '700', fontSize: 16 },

  skipBtn: { marginTop: Spacing.lg, padding: Spacing.sm },
  skipText: { color: Colors.textTertiary, fontWeight: '600' },
});
