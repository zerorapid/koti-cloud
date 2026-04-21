import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { Colors, Radii, Spacing } from '../theme';

const { width: SCREEN_W } = Dimensions.get('window');

interface SkeletonProps {
  width?: any;
  height: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton = ({ width = '100%', height, borderRadius = Radii.sm, style }: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, borderRadius, opacity },
        style,
      ]}
    />
  );
};

// ─── Pre-built Skeletons ──────────────────────────────────────────────────────

export const BannerSkeleton = () => (
  <View style={styles.bannerContainer}>
    <Skeleton width={SCREEN_W - 32} height={140} borderRadius={Radii.lg} />
  </View>
);

export const CategorySkeleton = () => (
  <View style={styles.row}>
    {[1, 2, 3, 4].map((i) => (
      <View key={i} style={styles.catItem}>
        <Skeleton width={60} height={60} borderRadius={Radii.md} />
        <View style={{ marginTop: 8 }}>
          <Skeleton width={40} height={10} />
        </View>
      </View>
    ))}
  </View>
);

export const ProductSkeleton = () => (
  <View style={styles.productCard}>
    <Skeleton width="100%" height={100} borderRadius={Radii.md} />
    <View style={{ marginTop: 12, gap: 8 }}>
      <Skeleton width="80%" height={14} />
      <Skeleton width="40%" height={12} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <Skeleton width="30%" height={20} />
        <Skeleton width="40%" height={30} borderRadius={Radii.sm} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  base: { backgroundColor: '#E1E9EE' },
  bannerContainer: { paddingHorizontal: 16, marginBottom: 16 },
  row: { flexDirection: 'row', paddingHorizontal: 16, gap: 16, marginBottom: 24 },
  catItem: { alignItems: 'center' },
  productCard: { width: 160, padding: 12, backgroundColor: Colors.surface, borderRadius: Radii.md, marginRight: 12 },
});
