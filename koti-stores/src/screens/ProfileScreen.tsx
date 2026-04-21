import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, MapPin, Package, Settings, LogOut, ShoppingBag } from 'lucide-react-native';
import { useCart } from '../CartContext';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';

export default function ProfileScreen({ navigation }: any) {
  const { orders, activeAddress, totalItems } = useCart();

  const MENU = [
    {
      id: 'orders',
      title: 'My Orders',
      subtitle: `${orders.length} order${orders.length !== 1 ? 's' : ''} placed`,
      icon: <Package size={22} color={Colors.primary} />,
      onPress: () => navigation.navigate('Orders'),
    },
    {
      id: 'address',
      title: 'Saved Addresses',
      subtitle: `Delivering to: ${activeAddress.label}`,
      icon: <MapPin size={22} color={Colors.primary} />,
      onPress: () => navigation.navigate('AddressList'),
    },
    {
      id: 'support',
      title: 'Customer Support',
      subtitle: 'Chat with our help desk',
      icon: <ShoppingBag size={22} color={Colors.primary} />,
      onPress: () => navigation.navigate('SupportChat'),
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Notifications, password, language',
      icon: <Settings size={22} color={Colors.primary} />,
      onPress: () => navigation.navigate('Settings'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Profile header ── */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>J</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Jayapal</Text>
            <Text style={styles.userPhone}>+91 9876543210</Text>
          </View>
          <TouchableOpacity 
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {orders.filter((o) => o.status === 'delivered').length}
            </Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{totalItems}</Text>
            <Text style={styles.statLabel}>In Cart</Text>
          </View>
        </View>

        {/* ── Menu ── */}
        <View style={styles.menu}>
          {MENU.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuIcon}>{item.icon}</View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <ChevronRight size={18} color={Colors.border} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={() => navigation.replace('Auth')}
        >
          <LogOut size={18} color={Colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surfaceGray },

  profileHeader: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, padding: Spacing.md,
    borderBottomWidth: 1, borderColor: Colors.border,
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  avatarText: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  userInfo: { flex: 1 },
  userName: { ...Typography.h3, marginBottom: 2 },
  userPhone: { ...Typography.bodySm },
  editBtn: {
    paddingHorizontal: Spacing.sm, paddingVertical: 5,
    borderWidth: 1, borderColor: Colors.primary,
    borderRadius: Radii.full,
  },
  editBtnText: { ...Typography.bodySm, color: Colors.primary, fontWeight: '700' },

  statsRow: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    marginTop: Spacing.xs, paddingVertical: Spacing.md,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { ...Typography.h2, color: Colors.primary },
  statLabel: { ...Typography.caption },
  statDivider: { width: 1, backgroundColor: Colors.divider },

  menu: { backgroundColor: Colors.surface, marginTop: Spacing.sm },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, borderBottomWidth: 1, borderColor: Colors.divider,
  },
  menuIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  menuText: { flex: 1 },
  menuTitle: { ...Typography.label, marginBottom: 2 },
  menuSubtitle: { ...Typography.caption },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.xs, marginTop: Spacing.md, padding: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radii.md,
    marginHorizontal: Spacing.md,
  },
  logoutText: { ...Typography.label, color: Colors.error },
});
