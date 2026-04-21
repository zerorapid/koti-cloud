import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';

export default function EditProfileScreen({ navigation }: any) {
  const [name, setName] = useState('Jayapal');
  const [email, setEmail] = useState('jayapal@example.com');
  const [phone, setPhone] = useState('+91 9876543210');

  const handleSave = () => {
    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>J</Text>
            <TouchableOpacity style={styles.cameraBtn}>
              <Camera size={16} color={Colors.surface} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={[styles.label, { marginTop: Spacing.lg }]}>Email Address</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

          <Text style={[styles.label, { marginTop: Spacing.lg }]}>Phone Number</Text>
          <TextInput style={[styles.input, styles.inputDisabled]} value={phone} editable={false} />
          <Text style={styles.hint}>Phone number cannot be changed</Text>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surfaceGray },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, padding: Spacing.md,
    borderBottomWidth: 1, borderColor: Colors.border,
  },
  backBtn: { padding: Spacing.xxs },
  headerTitle: { ...Typography.h3 },

  scroll: { padding: Spacing.md },
  avatarSection: { alignItems: 'center', marginVertical: Spacing.xl },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: Colors.primary },
  cameraBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: Colors.surface,
  },

  form: { backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: Radii.md, ...Shadows.sm },
  label: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '700', marginBottom: 6 },
  input: { 
    ...Typography.body, color: Colors.text, padding: Spacing.sm, 
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radii.sm 
  },
  inputDisabled: { backgroundColor: Colors.surfaceGray, color: Colors.textTertiary },
  hint: { ...Typography.caption, color: Colors.textTertiary, marginTop: 4 },

  saveBtn: { 
    backgroundColor: Colors.primary, padding: Spacing.md, 
    borderRadius: Radii.md, alignItems: 'center', marginTop: Spacing.xl 
  },
  saveBtnText: { color: Colors.surface, fontWeight: '700', fontSize: 16 },
});
