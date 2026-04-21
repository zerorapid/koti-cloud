import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Crown, Zap, ShieldCheck, CheckCircle, Star } from 'lucide-react-native';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';
import { useCart } from '../CartContext';

const { width } = Dimensions.get('window');

const TIERS = [
  {
    id: 'gold',
    name: 'Gold',
    discount: '25% OFF',
    minOrder: '₹500+',
    color: '#D4AF37', // Gold
    progress: 0.33,
    benefits: ['Priority Support', 'Exclusive Gold Deals'],
    icon: <Crown size={24} color="#D4AF37" />
  },
  {
    id: 'platinum',
    name: 'Platinum',
    discount: '30% OFF',
    minOrder: '₹1000+',
    color: '#708090', // Platinum/Slate
    progress: 0.66,
    benefits: ['Free Returns', 'Early Access to Sales'],
    icon: <Star size={24} color="#708090" />
  },
  {
    id: 'diamond',
    name: 'Diamond',
    discount: '35% OFF',
    minOrder: '₹2000+',
    color: '#7C3AED', // Luxury Violet
    progress: 1.0,
    benefits: ['Free Delivery Always', 'No Platform Fee', 'VIP Assistant'],
    icon: <Zap size={24} color="#7C3AED" />
  }
];

export default function MembershipTiersScreen({ navigation }: any) {
  const { currentTier } = useCart();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Grand Background Mock */}
        <View style={styles.grandBackground}>
           <View style={styles.redBlob1} />
           <View style={styles.redBlob2} />
        </View>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Koti Discounts</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Grand Loyalty Rewards</Text>
            <Text style={styles.heroSubtitle}>The more you shop, the grander your savings. Unlock premium tiers automatically.</Text>
          </View>

          {TIERS.map((tier) => (
            <View 
              key={tier.id} 
              style={[
                styles.tierCard, 
                currentTier === tier.id && styles.activeTierCard,
                { borderColor: tier.color + '22' }
              ]}
            >
              <View style={styles.tierHeader}>
                <View style={[styles.iconContainer, { backgroundColor: tier.color + '15' }]}>
                  {tier.icon}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.tierName, { color: tier.color }]}>{tier.name} Rewards</Text>
                  <Text style={styles.tierCondition}>Unlocked at {tier.minOrder}</Text>
                </View>
                <View style={[styles.discountTag, { backgroundColor: tier.color }]}>
                   <Text style={styles.discountValue}>{tier.discount}</Text>
                </View>
              </View>

              {/* Progress Bar (Discount Bar) */}
              <View style={styles.barContainer}>
                <View style={styles.barBackground}>
                   <View style={[styles.barFill, { width: `${tier.progress * 100}%`, backgroundColor: tier.color }]} />
                </View>
                <View style={styles.barLabels}>
                   <Text style={styles.barLabelText}>Rewards Rank</Text>
                   <Text style={styles.barLabelText}>{tier.benefits.length} Benefits</Text>
                </View>
              </View>

              <View style={styles.benefitsGrid}>
                {tier.benefits.map((b, i) => (
                  <View key={i} style={styles.benefitItem}>
                    <ShieldCheck size={14} color={tier.color} />
                    <Text style={styles.benefitText}>{b}</Text>
                  </View>
                ))}
              </View>

              {currentTier === tier.id && (
                <View style={styles.activeLabel}>
                   <Crown size={12} color="#fff" />
                   <Text style={styles.activeLabelText}>CURRENT TIER</Text>
                </View>
              )}
            </View>
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#9F1239' },
  container: { flex: 1 },
  grandBackground: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: '#E11D48',
  },
  redBlob1: { 
    position: 'absolute', top: -100, right: -100, 
    width: 300, height: 300, borderRadius: 150, 
    backgroundColor: '#9F1239', opacity: 0.6 
  },
  redBlob2: { 
    position: 'absolute', bottom: -50, left: -50, 
    width: 250, height: 250, borderRadius: 125, 
    backgroundColor: '#BE123C', opacity: 0.4 
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },

  scroll: { padding: 16 },
  hero: { marginBottom: 24, alignItems: 'center' },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },

  tierCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    ...Shadows.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  activeTierCard: {
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  tierHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  iconContainer: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  tierName: { fontSize: 18, fontWeight: '900' },
  tierCondition: { fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  discountTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  discountValue: { color: '#fff', fontSize: 13, fontWeight: '900' },

  barContainer: { marginBottom: 20 },
  barBackground: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  barLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  barLabelText: { fontSize: 11, color: Colors.textTertiary, fontWeight: '700' },

  benefitsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: '45%' },
  benefitText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },

  activeLabel: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: '#10B981',
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 4,
    borderBottomLeftRadius: 16,
  },
  activeLabelText: { color: '#fff', fontSize: 10, fontWeight: '900' },
});
