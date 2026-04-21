import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, Apple, Milk, Coffee, Cookie, Drumstick, 
  Croissant, Wheat, Eraser, Bath, Snowflake 
} from 'lucide-react-native';
import { CATEGORIES } from '../constants';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';

const CATEGORY_ICONS: Record<string, any> = {
  fruits: Apple,
  dairy: Milk,
  beverages: Coffee,
  snacks: Cookie,
  meat: Drumstick,
  bakery: Croissant,
  staples: Wheat,
  household: Eraser,
  personal: Bath,
  frozen: Snowflake,
};

function CategoryIcon({ id, size = 44, color = Colors.primary }: { id: string; size?: number; color?: string }) {
  const Icon = CATEGORY_ICONS[id] || Apple;
  return <Icon size={size} color={color} />;
}

export default function CategoriesScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity style={styles.searchBtn} onPress={() => navigation.navigate('Search')}>
          <Search size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CategoryProducts', {
              categoryId: item.id,
              categoryName: item.name,
            })}
          >
            <CategoryIcon id={item.id} />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12,
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: Colors.text, letterSpacing: -0.5 },
  searchBtn: { padding: 4 },
  grid: { padding: 16 },
  card: {
    flex: 1, 
    margin: 8, 
    backgroundColor: '#fff',
    borderRadius: Radii.lg, 
    padding: 24, 
    alignItems: 'center',
    justifyContent: 'center', 
    minHeight: 150, 
    ...Shadows.md,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  name: { fontSize: 14, fontWeight: '800', color: '#1A1C1E', textAlign: 'center', marginTop: 14 },
});
