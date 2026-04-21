import React, { useState, useMemo, useRef } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet,
  TouchableOpacity, Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, Clock, TrendingUp } from 'lucide-react-native';
import { PRODUCTS } from '../constants';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';
import { ProductCard } from '../components/ProductCard';

const TRENDING = ['Milk', 'Eggs', 'Bananas', 'Bread', 'Paneer', 'Rice', 'Almonds'];
const RECENT_SEARCHES = ['Chicken', 'Greek Yoghurt', 'Orange Juice'];

export default function SearchScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  const showSuggestions = focused && query.trim().length < 2;
  const showResults    = query.trim().length >= 2;
  const noResults      = showResults && results.length === 0;

  const handleChip = (term: string) => {
    setQuery(term);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Search Bar ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <X size={22} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.inputWrap}>
          <Search size={18} color={Colors.placeholder} style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            autoFocus
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search products, categories…"
            placeholderTextColor={Colors.placeholder}
            style={styles.input}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <X size={16} color={Colors.placeholder} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Suggestions (idle state) ── */}
      {showSuggestions && (
        <View style={styles.suggestionBlock}>
          {/* Trending */}
          <Text style={styles.sectionLabel}>🔥 Trending</Text>
          <View style={styles.chips}>
            {TRENDING.map((t) => (
              <TouchableOpacity key={t} style={styles.chip} onPress={() => handleChip(t)}>
                <TrendingUp size={12} color={Colors.primary} />
                <Text style={styles.chipText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent */}
          <Text style={[styles.sectionLabel, { marginTop: Spacing.md }]}>🕐 Recent</Text>
          {RECENT_SEARCHES.map((r) => (
            <TouchableOpacity key={r} style={styles.recentRow} onPress={() => handleChip(r)}>
              <Clock size={16} color={Colors.textTertiary} />
              <Text style={styles.recentText}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── No Results ── */}
      {noResults && (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No results for "{query}"</Text>
          <Text style={styles.emptySubtitle}>Try a different spelling or browse categories</Text>
        </View>
      )}

      {/* ── Results ── */}
      {showResults && !noResults && (
        <>
          <Text style={styles.resultCount}>
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </Text>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.grid}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
              />
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surfaceGray },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  backBtn: { padding: Spacing.xs },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceGray,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.sm,
    height: 44,
  },
  searchIcon: { marginRight: Spacing.xs },
  input: {
    flex: 1,
    ...Typography.body,
    paddingVertical: 0,
  },
  clearBtn: { padding: Spacing.xxs },

  // Suggestions
  suggestionBlock: {
    backgroundColor: Colors.surface,
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  sectionLabel: { ...Typography.label, marginBottom: Spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs + 2,
    gap: 4,
  },
  chipText: { ...Typography.bodySm, color: Colors.primary, fontWeight: '600' },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderColor: Colors.divider,
    gap: Spacing.sm,
  },
  recentText: { ...Typography.body, color: Colors.text },

  // Results
  resultCount: {
    ...Typography.caption,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    color: Colors.textSecondary,
  },
  grid: { padding: Spacing.xs, paddingBottom: Spacing.xl },

  // Empty
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: { ...Typography.h3, marginBottom: Spacing.xs },
  emptySubtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
});
