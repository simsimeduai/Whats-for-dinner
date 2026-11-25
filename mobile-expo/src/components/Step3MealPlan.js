import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Share,
  ActivityIndicator
} from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  DAYS,
  DAYS_SHORT,
  MEAL_TYPES,
  getIngredientSwaps,
  formatMealPlanText
} from '../utils/planner';

export default function Step3MealPlan({
  plan,
  groceriesCount,
  cuisinesCount,
  shoppingList,
  onAddShoppingItem,
  onAddAllMissing,
  onOpenShoppingList,
  onRegenerate,
  onSearchWeb,
  searchingWeb
}) {
  const [selectedDay, setSelectedDay] = useState('all');
  const [expandedCards, setExpandedCards] = useState({});
  const [activeSwaps, setActiveSwaps] = useState({}); // { [recipeId-ing]: swappedTo }

  const toggleCard = (key) => {
    setExpandedCards((prev) => ({ ...prev, [key]: !prev[key] }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSharePlan = async () => {
    try {
      await Share.share({
        title: "What's for Dinner — Weekly Meal Plan",
        message: formatMealPlanText(plan)
      });
    } catch {
      // User cancelled share sheet
    }
  };

  const isInShoppingList = (name) =>
    shoppingList.some((i) => i.name === name.toLowerCase().trim());

  const visibleDays =
    selectedDay === 'all'
      ? DAYS
      : DAYS.filter((d) => d.toLowerCase() === selectedDay);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Weekly Meal Plan</Text>
      <Text style={styles.subtitle}>Tap any meal for ingredients, swaps & shopping list</Text>

      {/* Stats + Action Row */}
      <View style={styles.actionCard}>
        <View style={styles.statsRow}>
          <View style={styles.statBadge}>
            <Text style={styles.statText}>🧺 {groceriesCount} items</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statText}>🌍 {cuisinesCount} cuisine{cuisinesCount === 1 ? '' : 's'}</Text>
          </View>
        </View>

        <View style={styles.actionBtnRow}>
          <TouchableOpacity style={styles.actionPrimary} onPress={onOpenShoppingList}>
            <Text style={styles.actionPrimaryText}>
              🛒 List ({shoppingList.filter((i) => !i.checked).length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionSecondary} onPress={handleSharePlan}>
            <Text style={styles.actionSecondaryText}>📤 Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionSecondary}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onRegenerate();
            }}
          >
            <Text style={styles.actionSecondaryText}>🔄 Shuffle</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.webSearchBtn}
          disabled={searchingWeb}
          onPress={onSearchWeb}
        >
          {searchingWeb ? (
            <ActivityIndicator size="small" color="#0369A1" />
          ) : (
            <Text style={styles.webSearchText}>🌐 Search More Web Recipes</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Horizontal Day Selector Pill Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayPillBar}
      >
        <TouchableOpacity
          style={[styles.dayPill, selectedDay === 'all' && styles.dayPillActive]}
          onPress={() => {
            setSelectedDay('all');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={[styles.dayPillText, selectedDay === 'all' && styles.dayPillTextActive]}>
            All
          </Text>
        </TouchableOpacity>

        {DAYS.map((day, idx) => {
          const key = day.toLowerCase();
          const active = selectedDay === key;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.dayPill, active && styles.dayPillActive]}
              onPress={() => {
                setSelectedDay(key);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={[styles.dayPillText, active && styles.dayPillTextActive]}>
                {DAYS_SHORT[idx]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Days & Meal Cards */}
      {visibleDays.map((day) => {
        const dayKey = day.toLowerCase();
        const dayPlan = plan?.[dayKey];
        if (!dayPlan) return null;

        const totalMissing = Object.values(dayPlan).reduce(
          (sum, r) => sum + (r?.missingIngredients?.length || 0),
          0
        );

        return (
          <View key={dayKey} style={styles.dayBlock}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayName}>{day}</Text>
              <View style={[styles.missingBadge, totalMissing === 0 && styles.coveredBadge]}>
                <Text style={[styles.missingBadgeText, totalMissing === 0 && styles.coveredBadgeText]}>
                  {totalMissing === 0 ? '✓ All covered' : `${totalMissing} missing`}
                </Text>
              </View>
            </View>

            <View style={styles.mealsList}>
              {MEAL_TYPES.map((meta) => {
                const recipe = dayPlan[meta.id];
                if (!recipe) return null;
                const cardKey = `${dayKey}-${meta.id}`;
                const isOpen = !!expandedCards[cardKey];
                const matchPct = Math.round((recipe.score || 0) * 100);

                return (
                  <View key={cardKey} style={styles.mealCard}>
                    <TouchableOpacity
                      style={styles.mealHeader}
                      onPress={() => toggleCard(cardKey)}
                      activeOpacity={0.75}
                    >
                      <View style={[styles.mealAccent, { backgroundColor: meta.color }]} />
                      <View style={styles.mealHeaderBody}>
                        <View style={styles.mealTopRow}>
                          <Text style={styles.mealTypeText}>
                            {meta.icon} {meta.label}
                          </Text>
                          <Text style={styles.matchText}>{matchPct}% match</Text>
                        </View>
                        <Text style={styles.recipeName}>{recipe.name}</Text>
                        <Text style={styles.recipeMeta}>
                          {recipe.cuisine} • ⏱ {recipe.prepTime} min • {recipe.difficulty}
                        </Text>
                      </View>
                      <Text style={styles.expandChevron}>{isOpen ? '▲' : '▼'}</Text>
                    </TouchableOpacity>

                    {isOpen && (
                      <View style={styles.mealDetail}>
                        {!!recipe.description && (
                          <Text style={styles.recipeDesc}>{recipe.description}</Text>
                        )}

                        {recipe.dietarySwap && (
                          <View style={styles.dietSwapBox}>
                            <Text style={styles.dietSwapText}>
                              💡 {recipe.dietarySwap.forFlag} swap: replace{' '}
                              <Text style={{ fontWeight: '700' }}>{recipe.dietarySwap.protein}</Text> with{' '}
                              <Text style={{ fontWeight: '700' }}>{recipe.dietarySwap.swapTo}</Text>
                            </Text>
                          </View>
                        )}

                        {/* Matched Ingredients */}
                        {recipe.matchedIngredients?.length > 0 && (
                          <View style={styles.ingGroup}>
                            <Text style={styles.ingGroupLabel}>✅ You Have</Text>
                            <View style={styles.chipWrap}>
                              {recipe.matchedIngredients.map((ing) => (
                                <View key={ing} style={styles.haveChip}>
                                  <Text style={styles.haveChipText}>{ing}</Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        )}

                        {/* Missing Ingredients + Swaps + Add to List */}
                        {recipe.missingIngredients?.length > 0 && (
                          <View style={styles.ingGroup}>
                            <View style={styles.missingHeader}>
                              <Text style={styles.ingGroupLabel}>🛒 Missing</Text>
                              <TouchableOpacity
                                onPress={() => {
                                  onAddAllMissing(recipe.missingIngredients, recipe.name);
                                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                }}
                              >
                                <Text style={styles.addAllText}>+ Add all to list</Text>
                              </TouchableOpacity>
                            </View>

                            <View style={{ gap: 8 }}>
                              {recipe.missingIngredients.map((ing) => {
                                const swapKey = `${recipe.id}-${ing}`;
                                const swapped = activeSwaps[swapKey];
                                const swapOptions = getIngredientSwaps(ing);
                                const targetName = swapped || ing;
                                const inList = isInShoppingList(targetName);

                                return (
                                  <View key={ing} style={styles.missingRow}>
                                    <View style={styles.missingLeft}>
                                      <View style={styles.missingChip}>
                                        <Text style={styles.missingChipText}>
                                          {swapped ? `${swapped} (for ${ing})` : ing}
                                        </Text>
                                      </View>
                                      {swapOptions.length > 0 && (
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                          <View style={styles.swapRow}>
                                            <Text style={styles.swapHint}>Swap:</Text>
                                            {swapOptions.map((alt) => (
                                              <TouchableOpacity
                                                key={alt}
                                                style={[
                                                  styles.swapPill,
                                                  swapped === alt && styles.swapPillActive
                                                ]}
                                                onPress={() => {
                                                  setActiveSwaps((prev) => ({
                                                    ...prev,
                                                    [swapKey]: prev[swapKey] === alt ? null : alt
                                                  }));
                                                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                }}
                                              >
                                                <Text style={styles.swapPillText}>{alt}</Text>
                                              </TouchableOpacity>
                                            ))}
                                          </View>
                                        </ScrollView>
                                      )}
                                    </View>

                                    <TouchableOpacity
                                      style={[styles.addListBtn, inList && styles.addListBtnAdded]}
                                      disabled={inList}
                                      onPress={() => {
                                        onAddShoppingItem(targetName, recipe.name);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                      }}
                                    >
                                      <Text style={[styles.addListText, inList && styles.addListTextAdded]}>
                                        {inList ? '✓' : '+ List'}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                );
                              })}
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14 },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#475569', textAlign: 'center' },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    gap: 10,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  statsRow: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  statBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statText: { fontSize: 13, fontWeight: '700', color: '#334155' },
  actionBtnRow: { flexDirection: 'row', gap: 8 },
  actionPrimary: {
    flex: 1.2,
    backgroundColor: '#38BDF8',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center'
  },
  actionPrimaryText: { color: '#0C4A6E', fontWeight: '700', fontSize: 13 },
  actionSecondary: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  actionSecondaryText: { color: '#1E293B', fontWeight: '700', fontSize: 13 },
  webSearchBtn: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center'
  },
  webSearchText: { color: '#0369A1', fontWeight: '700', fontSize: 13 },
  dayPillBar: { gap: 8, paddingVertical: 2 },
  dayPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#CBD5E1'
  },
  dayPillActive: { backgroundColor: '#38BDF8', borderColor: '#38BDF8' },
  dayPillText: { fontSize: 14, fontWeight: '700', color: '#334155' },
  dayPillTextActive: { color: '#0C4A6E' },
  dayBlock: { gap: 8 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 },
  dayName: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  missingBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14 },
  coveredBadge: { backgroundColor: '#DCFCE7' },
  missingBadgeText: { fontSize: 12, fontWeight: '700', color: '#991B1B' },
  coveredBadgeText: { color: '#166534' },
  mealsList: { gap: 10 },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2
  },
  mealHeader: { flexDirection: 'row', alignItems: 'center', paddingRight: 14 },
  mealAccent: { width: 5, alignSelf: 'stretch' },
  mealHeaderBody: { flex: 1, padding: 13 },
  mealTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  mealTypeText: { fontSize: 12, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
  matchText: { fontSize: 12, fontWeight: '700', color: '#0284C7' },
  recipeName: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  recipeMeta: { fontSize: 12, color: '#64748B', marginTop: 3 },
  expandChevron: { fontSize: 12, color: '#94A3B8' },
  mealDetail: { padding: 14, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 12 },
  recipeDesc: { fontSize: 13, color: '#475569', lineHeight: 19 },
  dietSwapBox: { backgroundColor: '#FEF3C7', padding: 10, borderRadius: 10 },
  dietSwapText: { fontSize: 12, color: '#92400E' },
  ingGroup: { gap: 6 },
  ingGroupLabel: { fontSize: 12, fontWeight: '700', color: '#334155' },
  missingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addAllText: { fontSize: 12, fontWeight: '700', color: '#0284C7' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  haveChip: { backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14 },
  haveChipText: { fontSize: 12, fontWeight: '600', color: '#166534' },
  missingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  missingLeft: { flex: 1, gap: 4 },
  missingChip: { alignSelf: 'flex-start', backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14 },
  missingChipText: { fontSize: 12, fontWeight: '600', color: '#991B1B' },
  swapRow: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingTop: 2 },
  swapHint: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  swapPill: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  swapPillActive: { backgroundColor: '#BAE6FD' },
  swapPillText: { fontSize: 11, fontWeight: '600', color: '#0F172A' },
  addListBtn: { backgroundColor: '#E0F2FE', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12 },
  addListBtnAdded: { backgroundColor: '#DCFCE7' },
  addListText: { fontSize: 12, fontWeight: '700', color: '#0369A1' },
  addListTextAdded: { color: '#166534' }
});
