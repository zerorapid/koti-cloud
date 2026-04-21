import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, ChevronRight, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react-native';
import { useCart } from '../CartContext';
import { Order } from '../types';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';

const STATUS_CONFIG = {
  pending:   { label: 'In Progress', color: Colors.warning,  Icon: Clock         },
  delivered: { label: 'Delivered',   color: Colors.success,  Icon: CheckCircle   },
  cancelled: { label: 'Cancelled',   color: Colors.error,    Icon: XCircle       },
};

const TABS = ['All', 'Pending', 'Delivered', 'Cancelled'] as const;
type Tab = typeof TABS[number];

export default function OrdersScreen({ navigation }: any) {
  const { orders, cart, addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<Tab>('All');

  const filtered: Order[] = activeTab === 'All'
    ? orders
    : orders.filter((o) => o.status === activeTab.toLowerCase() as Order['status']);

  const reorder = (order: Order) => {
    order.items.forEach((item) => addToCart(item));
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Package size={56} color={Colors.border} />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>Your placed orders will appear here</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const { label, color, Icon } = STATUS_CONFIG[item.status];
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('OrderDetail', { order: item })}
                activeOpacity={0.8}
              >
                {/* Top row */}
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.orderId}>{item.id}</Text>
                    <Text style={styles.orderDate}>{item.date}</Text>
                  </View>
                  <View style={styles.cardTopRight}>
                    <View style={[styles.statusBadge, { backgroundColor: color + '22' }]}>
                      <Icon size={13} color={color} />
                      <Text style={[styles.statusText, { color }]}>{label}</Text>
                    </View>
                    <ChevronRight size={18} color={Colors.border} />
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Items */}
                {item.items.map((i) => (
                  <View key={i.id} style={styles.itemRow}>
                    <Text style={styles.itemName} numberOfLines={1}>{i.name} ×{i.quantity}</Text>
                    <Text style={styles.itemPrice}>₹{i.price * i.quantity}</Text>
                  </View>
                ))}

                <View style={styles.divider} />

                {/* Bottom row */}
                <View style={styles.cardBottom}>
                  <View>
                    <Text style={styles.totalLabel}>Order Total</Text>
                    <Text style={styles.totalValue}>₹{item.total}</Text>
                  </View>
                  <TouchableOpacity style={styles.reorderBtn} onPress={() => reorder(item)}>
                    <RotateCcw size={14} color={Colors.primary} />
                    <Text style={styles.reorderText}>Reorder</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

  tabs: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  tab: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    marginHorizontal: 4,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabActive: { 
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  tabTextActive: { color: '#fff' },

  list: { padding: 16 },

  card: { 
    backgroundColor: '#F8F9FA', 
    borderRadius: Radii.md, 
    padding: 16, 
    marginBottom: 16, 
    ...Shadows.premium,
    borderWidth: 0,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardTopRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  orderId: { fontSize: 14, fontWeight: '800', color: '#1A1C1E', marginBottom: 2 },
  orderDate: { fontSize: 11, color: Colors.textTertiary, fontWeight: '600' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.full },
  statusText: { fontSize: 11, fontWeight: '800' },

  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  itemName: { flex: 1, fontSize: 13, color: '#4B5563', fontWeight: '600', marginRight: 8 },
  itemPrice: { fontSize: 13, fontWeight: '700', color: '#1A1C1E' },

  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  totalLabel: { fontSize: 11, color: Colors.textTertiary, fontWeight: '700' },
  totalValue: { fontSize: 18, fontWeight: '900', color: '#1A1C1E' },
  reorderBtn: { 
    flexDirection: 'row', alignItems: 'center', gap: 6, 
    paddingHorizontal: 16, paddingVertical: 8, 
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#E5E7EB', 
    borderRadius: Radii.sm,
    ...Shadows.sm
  },
  reorderText: { fontSize: 13, color: Colors.primary, fontWeight: '800' },

  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: '#1A1C1E', marginTop: 20 },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  shopBtn: { backgroundColor: Colors.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: Radii.md, ...Shadows.md },
  shopBtnText: { color: '#fff', fontWeight: '900', fontSize: 15 },
});
