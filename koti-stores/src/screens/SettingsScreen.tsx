import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Bell, Globe, Shield, Info, ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';

export default function SettingsScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState(true);
  const [offers, setOffers] = useState(true);

  const SETTINGS = [
    { id: 'lang', label: 'Language', value: 'English', icon: <Globe size={20} color={Colors.primary} /> },
    { id: 'privacy', label: 'Privacy Policy', value: '', icon: <Shield size={20} color={Colors.primary} /> },
    { id: 'terms', label: 'Terms of Service', value: '', icon: <Info size={20} color={Colors.primary} /> },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Bell size={20} color={Colors.primary} />
              <Text style={styles.rowLabel}>Order Updates</Text>
            </View>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications} 
              trackColor={{ true: Colors.primary }}
            />
          </View>
          <View style={[styles.row, { marginTop: Spacing.sm }]}>
            <View style={styles.rowLeft}>
              <Bell size={20} color={Colors.primary} />
              <Text style={styles.rowLabel}>Offers & Promos</Text>
            </View>
            <Switch 
              value={offers} 
              onValueChange={setOffers} 
              trackColor={{ true: Colors.primary }}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>General</Text>
        <View style={styles.section}>
          {SETTINGS.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.row}
              onPress={() => Alert.alert(item.label, `Redirecting to ${item.label.toLowerCase()}...`)}
            >
              <View style={styles.rowLeft}>
                {item.icon}
                <Text style={styles.rowLabel}>{item.label}</Text>
              </View>
              <View style={styles.rowRight}>
                {item.value ? <Text style={styles.rowValue}>{item.value}</Text> : null}
                <ChevronRight size={18} color={Colors.border} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0 (Build 42)</Text>
          <Text style={styles.copyright}>© 2024 Koti Stores Inc.</Text>
        </View>
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
  sectionTitle: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '700', marginBottom: 8, marginLeft: 4 },
  section: { backgroundColor: Colors.surface, borderRadius: Radii.md, padding: Spacing.md, ...Shadows.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  rowLabel: { ...Typography.body },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rowValue: { ...Typography.bodySm, color: Colors.textSecondary },

  footer: { marginTop: 40, alignItems: 'center' },
  version: { ...Typography.caption, color: Colors.textTertiary },
  copyright: { ...Typography.caption, color: Colors.textTertiary, marginTop: 4 },
});
