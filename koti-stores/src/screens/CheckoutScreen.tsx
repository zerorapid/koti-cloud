import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../CartContext';
import { MapPin, CreditCard, Truck, CheckCircle, ChevronRight, Smartphone, Banknote } from 'lucide-react-native';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';

type PaymentMethod = 'upi' | 'cod';

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { id: 'upi',  label: 'UPI Payment', icon: <Smartphone size={20} color={Colors.textSecondary} /> },
  { id: 'cod',  label: 'Cash on Delivery (15% OFF)',  icon: <Banknote size={20} color={Colors.textSecondary} /> },
];

export default function CheckoutScreen({ navigation }: any) {
  const {
    cart, activeAddress,
    subtotal, couponDiscount, couponCode,
    serviceFee, grandTotal,
    placeOrder,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId]                 = useState('');
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  // COD Discount calculation
  const codDiscount = paymentMethod === 'cod' ? Math.round(grandTotal * 0.15) : 0;
  const finalTotal = grandTotal - codDiscount;

  const handlePlaceOrder = () => {
    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      Alert.alert('Invalid UPI ID', 'Please enter a valid UPI ID (e.g. name@upi)');
      return;
    }
    Alert.alert('Confirm Order', `Pay ₹${finalTotal} via ${paymentMethod.toUpperCase()}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: () => {
          const id = placeOrder(paymentMethod);
          setPlacedOrderId(id);
        },
      },
    ]);
  };

  // ── Order Success ──────────────────────────────────────────────────────────
  if (placedOrderId) {
    return (
      <SafeAreaView style={styles.successContainer}>
        <CheckCircle size={88} color={Colors.success} />
        <Text style={styles.successTitle}>Order Placed! 🎉</Text>
        <Text style={styles.successOrderId}>{placedOrderId}</Text>
        <Text style={styles.successSubtitle}>
          Your order is confirmed and will be delivered in 30–45 minutes to{'\n'}
          <Text style={{ fontWeight: '700' }}>{activeAddress.label}: {activeAddress.line1}</Text>
        </Text>
        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() => { navigation.navigate('Home', { screen: 'OrderTracking' }); }}
        >
          <Text style={styles.trackBtnText}>Track Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.continueBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Checkout Form ──────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity
              style={styles.changeBtn}
              onPress={() => navigation.navigate('AddressList')}
            >
              <Text style={styles.changeBtnText}>Change</Text>
              <ChevronRight size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.addressLabel}>{activeAddress.label}</Text>
          <Text style={styles.addressLine}>{activeAddress.line1}</Text>
          <Text style={styles.addressLine}>{activeAddress.line2}</Text>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary ({cart.length} items)</Text>
          {cart.map((item) => (
            <View key={item.id} style={styles.orderRow}>
              <Text style={styles.orderItemName} numberOfLines={1}>
                {item.name}
                <Text style={styles.orderItemQty}> ×{item.quantity}</Text>
              </Text>
              <Text style={styles.orderItemPrice}>₹{item.price * item.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Bill Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          <BillRow label="Subtotal"                          value={`₹${subtotal}`} />
          {couponDiscount > 0 && (
            <BillRow label={`Coupon (${couponCode})`} value={`−₹${couponDiscount}`} green />
          )}
          <BillRow label="Service & Handling" value={`₹${serviceFee}`} />
          
          {paymentMethod === 'cod' && (
            <BillRow label="COD Special Discount (15%)" value={`−₹${codDiscount}`} green />
          )}

          <View style={styles.totalDivider} />
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>₹{finalTotal}</Text>
          </View>
        </View>

        {/* Delivery ETA */}
        <View style={[styles.section, styles.etaSection]}>
          <Truck size={18} color={Colors.primary} />
          <Text style={styles.etaText}>Estimated delivery in <Text style={{ fontWeight: '700' }}>30–45 minutes</Text></Text>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>
          {PAYMENT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.payOption, paymentMethod === opt.id && styles.payOptionActive]}
              onPress={() => setPaymentMethod(opt.id)}
            >
              <View style={[styles.radio, paymentMethod === opt.id && styles.radioFilled]} />
              <View style={styles.payIcon}>{opt.icon}</View>
              <Text style={[styles.payLabel, paymentMethod === opt.id && styles.payLabelActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
          {paymentMethod === 'upi' && (
            <TextInput
              style={styles.upiInput}
              value={upiId}
              onChangeText={setUpiId}
              placeholder="Enter UPI ID  e.g. name@okaxis"
              placeholderTextColor={Colors.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* CTA Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerTotal}>₹{finalTotal}</Text>
          <Text style={styles.footerNote}>Total payable</Text>
        </View>
        <TouchableOpacity style={styles.placeBtn} onPress={handlePlaceOrder}>
          <Text style={styles.placeBtnText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function BillRow({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <View style={styles.billRow}>
      <Text style={styles.billLabel}>{label}</Text>
      <Text style={[styles.billValue, green && styles.green]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surfaceGray },
  scroll: { padding: Spacing.md },
  section: { backgroundColor: Colors.surface, borderRadius: Radii.md, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadows.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.sm },
  sectionTitle: { flex: 1, ...Typography.h3 },
  changeBtn: { flexDirection: 'row', alignItems: 'center' },
  changeBtnText: { ...Typography.bodySm, color: Colors.primary, fontWeight: '700' },
  addressLabel: { ...Typography.label, color: Colors.primary, marginBottom: 2 },
  addressLine: { ...Typography.body, color: Colors.textSecondary, lineHeight: 20 },

  orderRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderColor: Colors.divider },
  orderItemName: { flex: 1, ...Typography.body, marginRight: Spacing.sm },
  orderItemQty: { color: Colors.textSecondary },
  orderItemPrice: { ...Typography.label },

  billRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  billLabel: { ...Typography.body, color: Colors.textSecondary },
  billValue: { ...Typography.body },
  green: { color: Colors.success, fontWeight: '700' },
  totalDivider: { height: 1, backgroundColor: Colors.divider, marginVertical: Spacing.xs },
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  grandTotalLabel: { ...Typography.h3 },
  grandTotalValue: { ...Typography.h3, color: Colors.primary },

  etaSection: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  etaText: { ...Typography.body, color: Colors.textSecondary },

  payOption: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.sm, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radii.sm, marginBottom: Spacing.xs, gap: Spacing.sm,
  },
  payOptionActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: Colors.border },
  radioFilled: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  payIcon: { fontSize: 18 },
  payLabel: { flex: 1, ...Typography.body },
  payLabelActive: { color: Colors.primary, fontWeight: '600' },
  upiInput: {
    marginTop: Spacing.xs, ...Typography.body,
    padding: Spacing.sm, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radii.sm, color: Colors.text,
  },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.md, backgroundColor: Colors.surface,
    borderTopWidth: 1, borderColor: Colors.border, ...Shadows.lg,
  },
  footerTotal: { ...Typography.h2 },
  footerNote: { ...Typography.caption },
  placeBtn: { backgroundColor: Colors.primary, paddingVertical: Spacing.sm + 2, paddingHorizontal: Spacing.lg, borderRadius: Radii.md },
  placeBtnText: { color: Colors.surface, fontSize: 16, fontWeight: '700' },

  // Success
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl, backgroundColor: Colors.surface },
  successTitle: { ...Typography.display, marginTop: Spacing.md, marginBottom: Spacing.xs },
  successOrderId: { ...Typography.bodySm, color: Colors.textSecondary, marginBottom: Spacing.md },
  successSubtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  trackBtn: { backgroundColor: Colors.primary, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xl, borderRadius: Radii.full, marginBottom: Spacing.sm },
  trackBtnText: { color: Colors.surface, fontWeight: '700', fontSize: 16 },
  continueBtn: { paddingVertical: Spacing.sm },
  continueBtnText: { color: Colors.primary, fontWeight: '600', fontSize: 15 },
});
