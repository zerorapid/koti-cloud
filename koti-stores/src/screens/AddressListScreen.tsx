import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, Briefcase, MapPin, Plus, Check, Trash2 } from 'lucide-react-native';
import { useCart } from '../CartContext';
import { SavedAddress } from '../types';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';

const LABEL_ICONS: Record<string, React.ReactNode> = {
  Home:   <Home   size={20} color={Colors.primary} />,
  Office: <Briefcase size={20} color={Colors.primary} />,
  Other:  <MapPin size={20} color={Colors.primary} />,
};

export default function AddressListScreen({ navigation }: any) {
  const { addresses, activeAddress, setActiveAddress, deleteAddress } = useCart();

  const confirmDelete = (a: SavedAddress) => {
    Alert.alert('Delete Address', `Remove "${a.label}: ${a.line1}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteAddress(a.id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={addresses}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.subtitle}>
            Tap an address to set it as your delivery location.
          </Text>
        }
        renderItem={({ item }) => {
          const isActive = item.id === activeAddress.id;
          return (
            <TouchableOpacity
              style={[styles.card, isActive && styles.cardActive]}
              onPress={() => setActiveAddress(item.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                {LABEL_ICONS[item.label] ?? LABEL_ICONS['Other']}
              </View>
              <View style={styles.info}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.line1}>{item.line1}</Text>
                <Text style={styles.line2}>{item.line2}</Text>
              </View>
              <View style={styles.actions}>
                {isActive && (
                  <View style={styles.activeBadge}>
                    <Check size={14} color={Colors.surface} />
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => confirmDelete(item)}
                  style={styles.deleteBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Trash2 size={16} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddAddress')}
          >
            <Plus size={20} color={Colors.primary} />
            <Text style={styles.addBtnText}>Add New Address</Text>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surfaceGray },
  list: { padding: Spacing.md },
  subtitle: { ...Typography.bodySm, marginBottom: Spacing.md, color: Colors.textSecondary },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.sm,
  },
  cardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  iconWrap: {
    width: 44, height: 44, borderRadius: Radii.full,
    backgroundColor: Colors.surfaceGray,
    justifyContent: 'center', alignItems: 'center',
    marginRight: Spacing.sm,
  },
  iconWrapActive: { backgroundColor: Colors.primaryLight },
  info: { flex: 1 },
  label: { ...Typography.label, marginBottom: 2 },
  line1: { ...Typography.body, color: Colors.textSecondary, marginBottom: 2 },
  line2: { ...Typography.caption },

  actions: { alignItems: 'center', gap: Spacing.xs },
  activeBadge: {
    width: 24, height: 24, borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  deleteBtn: { padding: Spacing.xxs },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radii.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  addBtnText: { ...Typography.label, color: Colors.primary },
});
