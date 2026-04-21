import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, MessageSquare, ChevronLeft, MapPin, Clock, CheckCircle2, Bike } from 'lucide-react-native';
import { useCart } from '../CartContext';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';

const STAGES = [
  { id: 1, title: 'Order Confirmed', time: '10:05 AM', icon: <CheckCircle2 size={18} color={Colors.success} /> },
  { id: 2, title: 'Preparing Items', time: '10:12 AM', icon: <Clock size={18} color={Colors.primary} /> },
  { id: 3, title: 'On the Way',      time: 'ETA 5 mins', icon: <MapPin size={18} color={Colors.primary} /> },
  { id: 4, title: 'Delivered',      time: '--',         icon: <CheckCircle2 size={18} color={Colors.border} /> },
];

export default function OrderTrackingScreen({ navigation }: any) {
  const { activeOrder } = useCart();
  const [currentStage, setCurrentStage] = useState(2); // Start at preparing

  // Mock progress simulation
  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStage(3), 8000);
    return () => clearTimeout(t1);
  }, []);

  if (!activeOrder) {
    return (
      <View style={styles.empty}>
        <Text>No active order to track</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text>Go Back</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Tracking Order</Text>
          <Text style={styles.headerSubtitle}>{activeOrder.id}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Mock Map */}
        <View style={styles.mapContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000&auto=format&fit=crop' }} 
            style={styles.map}
          />
          {/* Rider Marker */}
          <View style={styles.riderMarker}>
            <View style={styles.riderAvatar}>
              <Bike size={24} color={Colors.primary} />
            </View>
            <View style={styles.riderLabel}>
              <Text style={styles.riderLabelText}>Rider is near you</Text>
            </View>
          </View>
        </View>

        {/* Tracking Details */}
        <View style={styles.detailsCard}>
          <View style={styles.etaRow}>
            <View>
              <Text style={styles.etaLabel}>Estimated Delivery</Text>
              <Text style={styles.etaTime}>10:35 AM (12 mins)</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>On the Way</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Stepper */}
          <View style={styles.stepper}>
            {STAGES.map((stage, idx) => {
              const isPast = stage.id < currentStage;
              const isCurrent = stage.id === currentStage;
              return (
                <View key={stage.id} style={styles.stepRow}>
                  <View style={styles.stepLeft}>
                    <View style={[
                      styles.stepIcon, 
                      isPast && styles.stepIconPast, 
                      isCurrent && styles.stepIconCurrent
                    ]}>
                      {isPast ? <CheckCircle2 size={14} color={Colors.surface} /> : stage.icon}
                    </View>
                    {idx !== STAGES.length - 1 && (
                      <View style={[styles.stepLine, isPast && styles.stepLinePast]} />
                    )}
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={[styles.stepTitle, (isPast || isCurrent) && styles.stepTextActive]}>
                      {stage.title}
                    </Text>
                    <Text style={styles.stepTime}>{stage.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* Rider Info */}
          <View style={styles.riderCard}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?u=rider' }} 
              style={styles.riderImg} 
            />
            <View style={styles.riderMeta}>
              <Text style={styles.riderName}>Ramesh Kumar</Text>
              <Text style={styles.riderRating}>⭐ 4.9 (Professional)</Text>
            </View>
            <View style={styles.riderActions}>
              <TouchableOpacity 
                style={styles.chatBtn}
                onPress={() => navigation.navigate('SupportChat', { subject: 'Chat with Ramesh' })}
              >
                <MessageSquare size={18} color={Colors.surface} />
                <Text style={styles.chatBtnText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surfaceGray },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, padding: Spacing.md,
    borderBottomWidth: 1, borderColor: Colors.border,
  },
  backBtn: { padding: Spacing.xxs },
  headerTitle: { ...Typography.h3 },
  headerSubtitle: { ...Typography.caption, color: Colors.primary, fontWeight: '700' },

  mapContainer: { height: 300, backgroundColor: Colors.border },
  map: { width: '100%', height: '100%', opacity: 0.8 },
  riderMarker: {
    position: 'absolute', top: '40%', left: '50%',
    alignItems: 'center',
  },
  riderAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center', alignItems: 'center',
    ...Shadows.md,
  },
  riderEmoji: { fontSize: 20 },
  riderLabel: {
    backgroundColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: Radii.full, marginTop: 4, ...Shadows.sm,
  },
  riderLabelText: { color: Colors.surface, fontSize: 10, fontWeight: '700' },

  detailsCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radii.lg, borderTopRightRadius: Radii.lg,
    marginTop: -20, padding: Spacing.lg,
    ...Shadows.lg,
  },
  etaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  etaLabel: { ...Typography.caption, color: Colors.textSecondary },
  etaTime: { ...Typography.h2, color: Colors.text },
  statusBadge: {
    backgroundColor: Colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: Radii.full,
  },
  statusText: { color: Colors.primary, fontWeight: '800', fontSize: 12 },

  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: Spacing.lg },

  stepper: { paddingLeft: 4 },
  stepRow: { flexDirection: 'row', minHeight: 60 },
  stepLeft: { alignItems: 'center', width: 30 },
  stepIcon: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.surfaceGray,
    justifyContent: 'center', alignItems: 'center',
    zIndex: 10,
  },
  stepIconPast: { backgroundColor: Colors.success },
  stepIconCurrent: { backgroundColor: Colors.primaryLight, borderWidth: 1, borderColor: Colors.primary },
  stepLine: { width: 2, flex: 1, backgroundColor: Colors.divider, marginVertical: -2 },
  stepLinePast: { backgroundColor: Colors.success },
  stepInfo: { flex: 1, paddingLeft: Spacing.md, paddingTop: 2 },
  stepTitle: { ...Typography.body, color: Colors.textSecondary },
  stepTextActive: { color: Colors.text, fontWeight: '700' },
  stepTime: { ...Typography.caption, marginTop: 2 },

  riderCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  riderImg: { width: 50, height: 50, borderRadius: 25 },
  riderMeta: { flex: 1 },
  riderName: { ...Typography.label },
  riderRating: { ...Typography.caption, color: Colors.success, fontWeight: '600' },
  riderActions: { flexDirection: 'row', gap: Spacing.sm },
  chatBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: Radii.full, ...Shadows.sm,
  },
  chatBtnText: { color: Colors.surface, fontWeight: '700', fontSize: 14 },
});
