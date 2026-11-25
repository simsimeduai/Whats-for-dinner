import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { formatShoppingListText } from '../utils/planner';

const SECTIONS = ['Proteins', 'Produce', 'Dairy & Eggs', 'Pantry', 'Spices & Seasonings', 'Other'];

export default function ShoppingListModal({
  visible,
  items,
  onClose,
  onToggleItem,
  onRemoveItem,
  onClearAll
}) {
  const uncheckedCount = items.filter((i) => !i.checked).length;

  const handleShare = async () => {
    try {
      await Share.share({
        title: "Shopping List — What's for Dinner",
        message: formatShoppingListText(items)
      });
    } catch {
      // Cancelled
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>🛒 Shopping List</Text>
            <Text style={styles.subtitle}>{uncheckedCount} remaining of {items.length} items</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {items.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>🧺</Text>
              <Text style={styles.emptyTitle}>Your shopping list is empty</Text>
              <Text style={styles.emptySubtitle}>
                Tap "+ List" on any missing ingredient in your meal plan to collect it here.
              </Text>
            </View>
          ) : (
            SECTIONS.map((sec) => {
              const secItems = items.filter((i) => (SECTIONS.includes(i.category) ? i.category : 'Other') === sec);
              if (!secItems.length) return null;
              return (
                <View key={sec} style={styles.section}>
                  <Text style={styles.sectionTitle}>{sec}</Text>
                  {secItems.map((item) => (
                    <View key={item.name} style={styles.row}>
                      <TouchableOpacity
                        style={styles.rowMain}
                        onPress={() => {
                          onToggleItem(item.name);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                      >
                        <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                          {item.checked && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.itemName, item.checked && styles.itemChecked]}>
                            {item.name}
                          </Text>
                          {item.fromRecipes?.length > 0 && (
                            <Text style={styles.fromText} numberOfLines={1}>
                              For: {item.fromRecipes.join(', ')}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.delBtn}
                        onPress={() => onRemoveItem(item.name)}
                      >
                        <Text style={styles.delText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              );
            })
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.shareBtn, items.length === 0 && styles.disabledBtn]}
            disabled={items.length === 0}
            onPress={handleShare}
          >
            <Text style={styles.shareText}>📤 Share List</Text>
          </TouchableOpacity>
          {items.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={onClearAll}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  handle: { width: 42, height: 5, borderRadius: 3, backgroundColor: '#CBD5E1', alignSelf: 'center', marginTop: 8 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  title: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  closeBtn: { backgroundColor: '#E0F2FE', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  closeText: { color: '#0369A1', fontWeight: '700', fontSize: 14 },
  scroll: { flex: 1 },
  scrollContent: { padding: 18, gap: 16 },
  emptyBox: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 24 },
  emptyEmoji: { fontSize: 44, marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  emptySubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 6 },
  section: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, gap: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#0284C7', textTransform: 'uppercase', letterSpacing: 0.6 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: { width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: '#94A3B8', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#22C55E', borderColor: '#22C55E' },
  checkmark: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  itemName: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  itemChecked: { textDecorationLine: 'line-through', color: '#94A3B8' },
  fromText: { fontSize: 11, color: '#64748B', marginTop: 1 },
  delBtn: { padding: 8 },
  delText: { color: '#94A3B8', fontWeight: '700', fontSize: 14 },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF'
  },
  shareBtn: { flex: 1, backgroundColor: '#38BDF8', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  disabledBtn: { opacity: 0.45 },
  shareText: { color: '#0C4A6E', fontWeight: '800', fontSize: 15 },
  clearBtn: { backgroundColor: '#FEE2E2', paddingHorizontal: 18, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  clearText: { color: '#B91C1C', fontWeight: '700', fontSize: 14 }
});
