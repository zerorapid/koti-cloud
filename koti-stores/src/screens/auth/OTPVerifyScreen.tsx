import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Colors, Spacing, Typography, Radii } from '../../theme';

export default function OTPVerifyScreen({ route, navigation }: any) {
  const { phone } = route.params;
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    const t = setInterval(() => setTimer((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const handleVerify = () => {
    // Mock success
    navigation.navigate('ProfileSetup');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={28} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subtitle}>We have sent the code to +91 {phone}</Text>

          <View style={styles.otpContainer}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={[styles.otpBox, otp.length > i && styles.otpBoxActive]}>
                <Text style={styles.otpText}>{otp[i] || ''}</Text>
              </View>
            ))}
            <TextInput
              style={styles.hiddenInput}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={4}
              autoFocus
            />
          </View>

          <TouchableOpacity 
            style={[styles.verifyBtn, otp.length < 4 && styles.verifyBtnDisabled]}
            disabled={otp.length < 4}
            onPress={handleVerify}
          >
            <Text style={styles.verifyBtnText}>Verify & Proceed</Text>
          </TouchableOpacity>

          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>Didn't receive code? </Text>
            {timer > 0 ? (
              <Text style={styles.timerText}>Resend in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={() => setTimer(30)}>
                <Text style={styles.resendText}>Resend Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  header: { padding: Spacing.md },
  content: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  title: { ...Typography.display, fontSize: 28, marginBottom: Spacing.xs },
  subtitle: { ...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.xl + 20 },

  otpContainer: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.md, marginBottom: Spacing.xl },
  otpBox: { 
    width: 60, height: 64, borderRadius: Radii.md, 
    backgroundColor: Colors.surfaceGray, 
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: 'transparent'
  },
  otpBoxActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  otpText: { ...Typography.h2, color: Colors.primary },
  hiddenInput: { position: 'absolute', opacity: 0, width: '100%', height: '100%' },

  verifyBtn: { 
    width: '100%', backgroundColor: Colors.primary, 
    padding: Spacing.md, borderRadius: Radii.md, 
    alignItems: 'center', marginTop: Spacing.md
  },
  verifyBtnDisabled: { backgroundColor: Colors.border },
  verifyBtnText: { color: Colors.surface, fontWeight: '700', fontSize: 16 },

  resendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  resendLabel: { ...Typography.bodySm, color: Colors.textSecondary },
  timerText: { ...Typography.bodySm, color: Colors.textTertiary, fontWeight: '700' },
  resendText: { ...Typography.bodySm, color: Colors.primary, fontWeight: '700' },
});
