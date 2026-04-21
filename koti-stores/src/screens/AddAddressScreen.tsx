import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, Briefcase, MapPin } from 'lucide-react-native';
import { useCart } from '../CartContext';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';

const LABELS = ['Home', 'Office', 'Other'] as const;
type LabelType = typeof LABELS[number];

const LABEL_ICONS: Record<LabelType, React.ReactNode> = {
  Home:   <Home   size={18} color={Colors.primary} />,
  Office: <Briefcase size={18} color={Colors.primary} />,
  Other:  <MapPin size={18} color={Colors.primary} />,
};

export default function AddAddressScreen({ navigation }: any) {
  const { addAddress, setActiveAddress, addresses } = useCart();
  const [label, setLabel]   = useState<LabelType>('Home');
  const [line1, setLine1]   = useState('');
  const [line2, setLine2]   = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!line1.trim()) e.line1 = 'Street address is required';
    if (!line2.trim()) e.line2 = 'City / PIN is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    addAddress({ label, line1: line1.trim(), line2: line2.trim(), isDefault: false });
    // Set the newly added address as active
    const newId = `a${Date.now()}`;
    Alert.alert('Address Saved', `"${label}" address has been added.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Label selector */}
        <Text style={styles.fieldLabel}>Address Type</Text>
        <View style={styles.labelRow}>
          {LABELS.map((l) => (
            <TouchableOpacity
              key={l}
              style={[styles.labelChip, label === l && styles.labelChipActive]}
              onPress={() => setLabel(l)}
            >
              {LABEL_ICONS[l]}
              <Text style={[styles.labelChipText, label === l && styles.labelChipTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Street address */}
        <Text style={styles.fieldLabel}>Street / Flat / Building <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.line1 && styles.inputError]}
          value={line1}
          onChangeText={(v) => { setLine1(v); setErrors((e) => ({ ...e, line1: '' })); }}
          placeholder="e.g. 124, Park Avenue, 3rd Floor"
          placeholderTextColor={Colors.placeholder}
          multiline
          numberOfLines={2}
        />
        {errors.line1 ? <Text style={styles.errorText}>{errors.line1}</Text> : null}

        {/* City / PIN */}
        <Text style={styles.fieldLabel}>City / Area / PIN Code <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.line2 && styles.inputError]}
          value={line2}
          onChangeText={(v) => { setLine2(v); setErrors((e) => ({ ...e, line2: '' })); }}
          placeholder="e.g. Koramangala, Bangalore - 560034"
          placeholderTextColor={Colors.placeholder}
        />
        {errors.line2 ? <Text style={styles.errorText}>{errors.line2}</Text> : null}

        {/* Preview */}
        {(line1 || line2) && (
          <View style={styles.preview}>
            <Text style={styles.previewTitle}>Preview</Text>
            <Text style={styles.previewLabel}>{label}</Text>
            {line1 ? <Text style={styles.previewLine}>{line1}</Text> : null}
            {line2 ? <Text style={styles.previewLine}>{line2}</Text> : null}
          </View>
        )}
      </ScrollView>

      {/* Save button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surfaceGray },
  scroll: { padding: Spacing.md, paddingBottom: 100 },

  fieldLabel: { ...Typography.label, marginBottom: Spacing.xs, marginTop: Spacing.md },
  required: { color: Colors.error },

  // Label chips
  labelRow: { flexDirection: 'row', gap: Spacing.sm },
  labelChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, padding: Spacing.sm, borderRadius: Radii.sm,
    borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  labelChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  labelChipText: { ...Typography.label, fontSize: 13, color: Colors.textSecondary },
  labelChipTextActive: { color: Colors.primary },

  // Inputs
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radii.sm,
    padding: Spacing.sm,
    ...Typography.body,
    color: Colors.text,
    minHeight: 48,
  },
  inputError: { borderColor: Colors.error },
  errorText: { ...Typography.caption, color: Colors.error, marginTop: 4 },

  // Preview card
  preview: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    ...Shadows.sm,
  },
  previewTitle: { ...Typography.caption, marginBottom: 6 },
  previewLabel: { ...Typography.label, color: Colors.primary, marginBottom: 4 },
  previewLine: { ...Typography.body, color: Colors.textSecondary },

  // Footer
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  saveBtnText: { color: Colors.surface, fontSize: 16, fontWeight: '700' },
});
