import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Package, MapPin, CreditCard, Receipt, Repeat } from 'lucide-react-native';
import { useCart } from '../CartContext';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';

export default function OrderDetailScreen({ route, navigation }: any) {
  const { order } = route.params;
  const { addToCart } = useCart();

  const handleReorder = () => {
    order.items.forEach((item: any) => addToCart(item));
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Status Card */}
        <View style={styles.section}>
          <View style={styles.statusHeader}>
            <Package size={20} color={Colors.primary} />
            <Text style={styles.orderId}>ID: {order.id}</Text>
          </View>
          <Text style={styles.orderDate}>Placed on {order.date}</Text>
          <View style={[styles.statusBadge, order.status === 'delivered' ? styles.statusSuccess : styles.statusPending]}>
            <Text style={[styles.statusText, order.status === 'delivered' ? styles.textSuccess : styles.textPending]}>
              {order.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items in this order</Text>
          {order.items.map((item: any) => (
            <View key={item.id} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.itemImg} />
              <View style={styles.itemMeta}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>{item.unit} × {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Payment & Address */}
        <View style={styles.section}>
          <View style={styles.metaRow}>
            <MapPin size={18} color={Colors.textSecondary} />
            <View style={styles.metaTextWrap}>
              <Text style={styles.metaLabel}>Delivery Address</Text>
              <Text style={styles.metaValue}>{order.address}</Text>
            </View>
          </View>
          <View style={[styles.metaRow, { marginTop: Spacing.md }]}>
            <CreditCard size={18} color={Colors.textSecondary} />
            <View style={styles.metaTextWrap}>
              <Text style={styles.metaLabel}>Payment Method</Text>
              <Text style={styles.metaValue}>
                {order.paymentMethod?.toUpperCase() || 'UPI'}
              </Text>
            </View>
          </View>
        </View>

        {/* Bill Summary */}
        <View style={styles.section}>
          <View style={styles.billHeader}>
            <Receipt size={18} color={Colors.textSecondary} />
            <Text style={styles.sectionTitle}>Bill Summary</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹{order.total - 10}</Text> 
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Taxes & Fees</Text>
            <Text style={styles.billValue}>₹10</Text>
          </View>
          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>₹{order.total}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.reorderBtn} onPress={handleReorder}>
          <Repeat size={18} color={Colors.surface} />
          <Text style={styles.reorderText}>Repeat Order</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.helpBtn}
          onPress={() => navigation.navigate('SupportChat', { subject: `Help with Order ${order.id}` })}
        >
          <Text style={styles.helpText}>Need help with this order?</Text>
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
  section: { 
    backgroundColor: Colors.surface, borderRadius: Radii.md, 
    padding: Spacing.md, marginBottom: Spacing.sm, ...Shadows.sm 
  },
  statusHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  orderId: { ...Typography.label, color: Colors.text },
  orderDate: { ...Typography.caption, marginTop: 2, marginBottom: Spacing.sm },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.full },
  statusSuccess: { backgroundColor: Colors.success + '22' },
  statusPending: { backgroundColor: Colors.warning + '22' },
  statusText: { fontSize: 11, fontWeight: '800' },
  textSuccess: { color: Colors.success },
  textPending: { color: Colors.warning },

  sectionTitle: { ...Typography.label, fontSize: 14, marginBottom: Spacing.md },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  itemImg: { width: 44, height: 44, borderRadius: Radii.sm, backgroundColor: Colors.surfaceGray },
  itemMeta: { flex: 1, marginLeft: Spacing.sm },
  itemName: { ...Typography.bodySm, fontWeight: '600' },
  itemQty: { ...Typography.caption },
  itemPrice: { ...Typography.label, fontSize: 13 },

  metaRow: { flexDirection: 'row', gap: Spacing.sm },
  metaTextWrap: { flex: 1 },
  metaLabel: { ...Typography.caption, color: Colors.textSecondary },
  metaValue: { ...Typography.bodySm, fontWeight: '600', marginTop: 2 },

  billHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.sm },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  billLabel: { ...Typography.bodySm, color: Colors.textSecondary },
  billValue: { ...Typography.bodySm },
  totalRow: { borderTopWidth: 1, borderColor: Colors.divider, marginTop: 8, paddingTop: 8 },
  totalLabel: { ...Typography.label },
  totalValue: { ...Typography.h3, color: Colors.primary },

  reorderBtn: {
    backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', 
    justifyContent: 'center', gap: Spacing.sm, padding: Spacing.md, 
    borderRadius: Radii.md, marginTop: Spacing.md
  },
  reorderText: { color: Colors.surface, fontWeight: '700', fontSize: 16 },
  helpBtn: { padding: Spacing.md, alignItems: 'center' },
  helpText: { color: Colors.primary, fontWeight: '600', fontSize: 14 },
});
