import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { DEFAULT_PANTRY_STAPLES } from './src/data/recipeData';
import {
  CUISINES,
  generateMealPlan,
  getIngredientCategory,
  searchWebRecipes
} from './src/utils/planner';
import { loadJSON, saveJSON } from './src/utils/storage';

import Step1Pantry from './src/components/Step1Pantry';
import Step2Cuisines from './src/components/Step2Cuisines';
import Step3MealPlan from './src/components/Step3MealPlan';
import ShoppingListModal from './src/components/ShoppingListModal';

function MainApp() {
  const scrollRef = useRef(null);
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(1);
  const [groceries, setGroceries] = useState([]);
  const [pantryStaples, setPantryStaples] = useState(DEFAULT_PANTRY_STAPLES);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [customRecipes, setCustomRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [shoppingOpen, setShoppingOpen] = useState(false);
  const [shuffleOffset, setShuffleOffset] = useState(0);
  const [searchingWeb, setSearchingWeb] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  // Hydrate persisted state from AsyncStorage on launch
  useEffect(() => {
    (async () => {
      const [g, staples, cuisines, profs, custom, shop, savedStep] = await Promise.all([
        loadJSON('wfd_groceries', []),
        loadJSON('wfd_pantry_staples', DEFAULT_PANTRY_STAPLES),
        loadJSON('wfd_cuisines', []),
        loadJSON('wfd_profiles', []),
        loadJSON('wfd_custom_recipes', []),
        loadJSON('wfd_shopping_list', []),
        loadJSON('wfd_step', 1)
      ]);
      setGroceries(g);
      setPantryStaples(staples);
      setSelectedCuisines(cuisines);
      setProfiles(profs);
      setCustomRecipes(custom);
      setShoppingList(shop);
      if (savedStep === 3 && g.length > 0 && cuisines.length > 0) setStep(3);
      else if (savedStep === 2 && g.length > 0) setStep(2);
      setHydrated(true);
    })();
  }, []);

  // Persist changes automatically
  useEffect(() => { if (hydrated) saveJSON('wfd_groceries', groceries); }, [groceries, hydrated]);
  useEffect(() => { if (hydrated) saveJSON('wfd_pantry_staples', pantryStaples); }, [pantryStaples, hydrated]);
  useEffect(() => { if (hydrated) saveJSON('wfd_cuisines', selectedCuisines); }, [selectedCuisines, hydrated]);
  useEffect(() => { if (hydrated) saveJSON('wfd_profiles', profiles); }, [profiles, hydrated]);
  useEffect(() => { if (hydrated) saveJSON('wfd_custom_recipes', customRecipes); }, [customRecipes, hydrated]);
  useEffect(() => { if (hydrated) saveJSON('wfd_shopping_list', shoppingList); }, [shoppingList, hydrated]);
  useEffect(() => { if (hydrated) saveJSON('wfd_step', step); }, [step, hydrated]);

  const mealPlan = useMemo(() => {
    if (step !== 3 || !selectedCuisines.length) return null;
    return generateMealPlan(
      groceries,
      selectedCuisines,
      profiles,
      pantryStaples,
      customRecipes,
      shuffleOffset
    );
  }, [step, groceries, selectedCuisines, profiles, pantryStaples, customRecipes, shuffleOffset]);

  const goToStep = (nextStep) => {
    setStep(nextStep);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleNext = () => {
    if (step === 1) {
      if (groceries.length === 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        showToast('⚠️ Please add at least one grocery item first.');
        return;
      }
      goToStep(2);
    } else if (step === 2) {
      if (selectedCuisines.length === 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        showToast('⚠️ Please select at least one cuisine.');
        return;
      }
      goToStep(3);
    }
  };

  const addGrocery = (raw) => {
    const norm = raw.toLowerCase().trim();
    if (!norm) return;
    setGroceries((prev) => (prev.includes(norm) ? prev : [...prev, norm]));
  };

  const addManyGroceries = (items) => {
    setGroceries((prev) => {
      const next = [...prev];
      items.forEach((raw) => {
        const norm = raw.toLowerCase().trim();
        if (norm && !next.includes(norm)) next.push(norm);
      });
      return next;
    });
    showToast(`✅ Added ${items.length} item${items.length === 1 ? '' : 's'}!`);
  };

  const addShoppingItem = (name, fromRecipe = '') => {
    const norm = name.toLowerCase().trim();
    if (!norm) return;
    setShoppingList((prev) => {
      const existing = prev.find((i) => i.name === norm);
      if (existing) {
        if (fromRecipe && !existing.fromRecipes.includes(fromRecipe)) {
          return prev.map((i) =>
            i.name === norm ? { ...i, fromRecipes: [...i.fromRecipes, fromRecipe] } : i
          );
        }
        return prev;
      }
      return [
        ...prev,
        {
          name: norm,
          category: getIngredientCategory(norm),
          fromRecipes: fromRecipe ? [fromRecipe] : [],
          checked: false
        }
      ];
    });
  };

  const handleSearchWeb = async () => {
    setSearchingWeb(true);
    try {
      const imported = await searchWebRecipes(groceries, customRecipes);
      if (imported.length > 0) {
        setCustomRecipes((prev) => [...prev, ...imported]);
        setShuffleOffset((n) => n + 1);
        showToast(`🌐 Imported ${imported.length} new web recipes!`);
      } else {
        showToast('🔍 No new web recipes found for these items.');
      }
    } catch {
      Alert.alert('Offline', 'Could not reach TheMealDB. Built-in recipes still work offline!');
    } finally {
      setSearchingWeb(false);
    }
  };

  const uncheckedShoppingCount = shoppingList.filter((i) => !i.checked).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          🍽️ What's for <Text style={styles.logoAccent}>Dinner</Text>
        </Text>
        <Text style={styles.tagline}>Turn your groceries into a week of delicious meals</Text>
      </View>

      {/* Progress Stepper (hidden on Step 3 just like web app) */}
      {step < 3 && (
        <View style={styles.stepper}>
          {[
            { num: 1, label: 'Pantry' },
            { num: 2, label: 'Cuisines & Diet' },
            { num: 3, label: 'Meal Plan' }
          ].map((s) => {
            const active = step === s.num;
            const done = step > s.num;
            return (
              <TouchableOpacity
                key={s.num}
                disabled={s.num >= step}
                style={styles.stepItem}
                onPress={() => s.num < step && goToStep(s.num)}
              >
                <View
                  style={[
                    styles.stepCircle,
                    active && styles.stepCircleActive,
                    done && styles.stepCircleDone
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNum,
                      (active || done) && styles.stepNumActive
                    ]}
                  >
                    {done ? '✓' : s.num}
                  </Text>
                </View>
                <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Toast Notification */}
      {toast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}

      {/* Main Content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 && (
            <Step1Pantry
              groceries={groceries}
              onAddGrocery={addGrocery}
              onAddMany={addManyGroceries}
              onRemoveGrocery={(item) => setGroceries((prev) => prev.filter((g) => g !== item))}
              onClearGroceries={() => setGroceries([])}
              pantryStaples={pantryStaples}
              onAddStaple={(s) => {
                const norm = s.toLowerCase().trim();
                if (norm && !pantryStaples.includes(norm)) {
                  setPantryStaples((prev) => [...prev, norm]);
                }
              }}
              onRemoveStaple={(s) => setPantryStaples((prev) => prev.filter((x) => x !== s))}
            />
          )}

          {step === 2 && (
            <Step2Cuisines
              selectedCuisines={selectedCuisines}
              onToggleCuisine={(id) =>
                setSelectedCuisines((prev) =>
                  prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                )
              }
              onSelectAllCuisines={(selectAll) =>
                setSelectedCuisines(selectAll ? CUISINES.map((c) => c.id) : [])
              }
              profiles={profiles}
              onChangeProfiles={setProfiles}
            />
          )}

          {step === 3 && (
            <Step3MealPlan
              plan={mealPlan}
              groceriesCount={groceries.length}
              cuisinesCount={selectedCuisines.length}
              shoppingList={shoppingList}
              onAddShoppingItem={addShoppingItem}
              onAddAllMissing={(missingList, recipeName) => {
                missingList.forEach((m) => addShoppingItem(m, recipeName));
                showToast(`🛒 Added ${missingList.length} missing items to list!`);
              }}
              onOpenShoppingList={() => setShoppingOpen(true)}
              onRegenerate={() => setShuffleOffset((n) => n + 1)}
              onSearchWeb={handleSearchWeb}
              searchingWeb={searchingWeb}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Navigation Footer */}
      <View style={styles.footer}>
        {step > 1 ? (
          <TouchableOpacity style={styles.backBtn} onPress={() => goToStep(step - 1)}>
            <Text style={styles.backBtnText}>‹ Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 90 }} />
        )}

        {step < 3 ? (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {step === 2 ? 'Generate Plan ›' : 'Next ›'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.fabBtn}
            onPress={() => setShoppingOpen(true)}
          >
            <Text style={styles.fabText}>🛒 Shopping List ({uncheckedShoppingCount})</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Native iOS Slide-up Shopping List Modal */}
      <ShoppingListModal
        visible={shoppingOpen}
        items={shoppingList}
        onClose={() => setShoppingOpen(false)}
        onToggleItem={(name) =>
          setShoppingList((prev) =>
            prev.map((i) => (i.name === name ? { ...i, checked: !i.checked } : i))
          )
        }
        onRemoveItem={(name) =>
          setShoppingList((prev) => prev.filter((i) => i.name !== name))
        }
        onClearAll={() => setShoppingList([])}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF4FA' },
  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  logo: { fontSize: 21, fontWeight: '800', color: '#0F172A' },
  logoAccent: { color: '#0284C7' },
  tagline: { fontSize: 12, color: '#64748B', marginTop: 2 },
  stepper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepCircleActive: { backgroundColor: '#38BDF8' },
  stepCircleDone: { backgroundColor: '#22C55E' },
  stepNum: { fontSize: 13, fontWeight: '800', color: '#64748B' },
  stepNumActive: { color: '#FFFFFF' },
  stepLabel: { fontSize: 11, fontWeight: '600', color: '#64748B' },
  stepLabelActive: { color: '#0369A1', fontWeight: '700' },
  toast: {
    position: 'absolute',
    top: 86,
    alignSelf: 'center',
    zIndex: 50,
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  toastText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0'
  },
  backBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1'
  },
  backBtnText: { fontSize: 15, fontWeight: '700', color: '#334155' },
  nextBtn: {
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#38BDF8'
  },
  nextBtnText: { fontSize: 15, fontWeight: '800', color: '#0C4A6E' },
  fabBtn: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    alignItems: 'center'
  },
  fabText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' }
});
