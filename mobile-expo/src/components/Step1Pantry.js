import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { COMMON_GROCERIES } from '../data/recipeData';
import { parseReceiptText } from '../utils/planner';

const QUICK_ITEMS = [
  'chicken', 'rice', 'onion', 'tomato', 'garlic', 'egg',
  'milk', 'bread', 'butter', 'cheese', 'potato', 'bell pepper',
  'carrot', 'pasta', 'olive oil', 'spinach'
];

export default function Step1Pantry({
  groceries,
  onAddGrocery,
  onAddMany,
  onRemoveGrocery,
  onClearGroceries,
  pantryStaples,
  onAddStaple,
  onRemoveStaple
}) {
  const [mode, setMode] = useState('manual'); // 'manual' | 'scan' | 'paste'
  const [query, setQuery] = useState('');
  const [stapleQuery, setStapleQuery] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [receiptPhotoUri, setReceiptPhotoUri] = useState(null);
  const [showStaples, setShowStaples] = useState(false);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];
    return COMMON_GROCERIES.filter(
      (item) => item.includes(q) && !groceries.includes(item)
    ).slice(0, 6);
  }, [query, groceries]);

  const handleManualAdd = () => {
    const val = query.trim();
    if (!val) return;
    onAddGrocery(val);
    setQuery('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePickPhoto = async (useCamera) => {
    try {
      const perm = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!perm.granted) {
        Alert.alert(
          'Permission Needed',
          `Please allow ${useCamera ? 'Camera' : 'Photo Library'} access in iPhone Settings to capture receipts.`
        );
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({ quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setReceiptPhotoUri(result.assets[0].uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      Alert.alert('Camera Error', err.message || 'Could not open camera.');
    }
  };

  const handleParsePaste = () => {
    const items = parseReceiptText(pasteText);
    if (!items.length) {
      Alert.alert('No Items Found', 'Paste one item per line or comma-separated grocery items.');
      return;
    }
    onAddMany(items);
    setPasteText('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's in My Pantry?</Text>
      <Text style={styles.subtitle}>Add what you've got — we'll plan the week 🧡</Text>

      {/* Input Mode Switcher */}
      <View style={styles.modeRow}>
        {[
          { id: 'manual', icon: '✏️', label: 'Type' },
          { id: 'scan', icon: '📷', label: 'Receipt Photo' },
          { id: 'paste', icon: '📋', label: 'Paste List' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.modeBtn, mode === tab.id && styles.modeBtnActive]}
            onPress={() => {
              setMode(tab.id);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.75}
          >
            <Text style={styles.modeIcon}>{tab.icon}</Text>
            <Text style={[styles.modeLabel, mode === tab.id && styles.modeLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Mode 1: Manual Input */}
      {mode === 'manual' && (
        <View style={styles.card}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type an ingredient (e.g. chicken, okra)..."
              placeholderTextColor="#6B7280"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleManualAdd}
              returnKeyType="done"
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleManualAdd}>
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {suggestions.length > 0 && (
            <View style={styles.dropdown}>
              {suggestions.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.dropdownItem}
                  onPress={() => {
                    onAddGrocery(item);
                    setQuery('');
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text style={styles.dropdownText}>+ {item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.sectionLabel}>Quick add:</Text>
          <View style={styles.chipWrap}>
            {QUICK_ITEMS.map((item) => {
              const added = groceries.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  disabled={added}
                  style={[styles.quickChip, added && styles.quickChipAdded]}
                  onPress={() => {
                    onAddGrocery(item);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text style={[styles.quickChipText, added && styles.quickChipTextAdded]}>
                    {added ? `✓ ${item}` : `+ ${item}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Mode 2: Receipt Camera */}
      {mode === 'scan' && (
        <View style={styles.card}>
          <Text style={styles.cardHint}>
            Snap a photo of your grocery receipt or pick one from Photos. Use iPhone Live Text to copy lines and paste them below!
          </Text>
          <View style={styles.camBtnRow}>
            <TouchableOpacity style={styles.primaryCamBtn} onPress={() => handlePickPhoto(true)}>
              <Text style={styles.primaryCamText}>📷 Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryCamBtn} onPress={() => handlePickPhoto(false)}>
              <Text style={styles.secondaryCamText}>🖼️ Photos</Text>
            </TouchableOpacity>
          </View>
          {receiptPhotoUri && (
            <View style={styles.previewBox}>
              <Image source={{ uri: receiptPhotoUri }} style={styles.previewImg} resizeMode="cover" />
              <TouchableOpacity
                style={styles.switchPasteBtn}
                onPress={() => setMode('paste')}
              >
                <Text style={styles.switchPasteText}>Paste Copied Receipt Items →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Mode 3: Paste Receipt / Grocery List */}
      {mode === 'paste' && (
        <View style={styles.card}>
          <Text style={styles.cardHint}>
            Paste raw receipt text or a grocery list (prices, totals, and store headers are automatically cleaned!).
          </Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={5}
            placeholder={'e.g.\n2 x Chicken Breast $9.99\nOrganic Spinach 500g $3.49\nRoma Tomato $2.25'}
            placeholderTextColor="#6B7280"
            value={pasteText}
            onChangeText={setPasteText}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.parseBtn} onPress={handleParsePaste}>
            <Text style={styles.parseBtnText}>✨ Parse & Add Items</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Current Grocery List */}
      <View style={styles.card}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Your Groceries ({groceries.length})</Text>
          {groceries.length > 0 && (
            <TouchableOpacity onPress={onClearGroceries}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {groceries.length === 0 ? (
          <Text style={styles.emptyText}>No items added yet. Tap quick-add chips above to start!</Text>
        ) : (
          <View style={styles.chipWrap}>
            {groceries.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.groceryChip}
                onPress={() => {
                  onRemoveGrocery(item);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text style={styles.groceryChipText}>{item}</Text>
                <Text style={styles.groceryChipX}> ✕</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Collapsible Pantry Staples */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.listHeader}
          onPress={() => setShowStaples((s) => !s)}
        >
          <Text style={styles.listTitle}>🧂 Kitchen Staples ({pantryStaples.length})</Text>
          <Text style={styles.toggleText}>{showStaples ? 'Hide ▲' : 'Edit ▼'}</Text>
        </TouchableOpacity>

        {showStaples && (
          <View style={{ marginTop: 10 }}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Add pantry staple..."
                placeholderTextColor="#6B7280"
                value={stapleQuery}
                onChangeText={setStapleQuery}
                onSubmitEditing={() => {
                  if (stapleQuery.trim()) {
                    onAddStaple(stapleQuery.trim());
                    setStapleQuery('');
                  }
                }}
              />
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => {
                  if (stapleQuery.trim()) {
                    onAddStaple(stapleQuery.trim());
                    setStapleQuery('');
                  }
                }}
              >
                <Text style={styles.addBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.chipWrap, { marginTop: 10 }]}>
              {pantryStaples.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.stapleChip}
                  onPress={() => onRemoveStaple(s)}
                >
                  <Text style={styles.stapleChipText}>{s} ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14 },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#475569', textAlign: 'center', marginBottom: 4 },
  modeRow: { flexDirection: 'row', gap: 8 },
  modeBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0'
  },
  modeBtnActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#38BDF8'
  },
  modeIcon: { fontSize: 20, marginBottom: 2 },
  modeLabel: { fontSize: 12, fontWeight: '600', color: '#475569' },
  modeLabelActive: { color: '#0369A1', fontWeight: '700' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A'
  },
  addBtn: {
    backgroundColor: '#38BDF8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center'
  },
  addBtnText: { color: '#0C4A6E', fontWeight: '700', fontSize: 15 },
  dropdown: {
    marginTop: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden'
  },
  dropdownItem: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  dropdownText: { fontSize: 15, color: '#0F172A', fontWeight: '500' },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#64748B', marginTop: 14, marginBottom: 8 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  quickChipAdded: { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' },
  quickChipText: { fontSize: 13, color: '#334155', fontWeight: '600' },
  quickChipTextAdded: { color: '#166534' },
  cardHint: { fontSize: 13, color: '#475569', marginBottom: 12, lineHeight: 19 },
  camBtnRow: { flexDirection: 'row', gap: 10 },
  primaryCamBtn: {
    flex: 1,
    backgroundColor: '#38BDF8',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center'
  },
  primaryCamText: { color: '#0C4A6E', fontWeight: '700', fontSize: 15 },
  secondaryCamBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1'
  },
  secondaryCamText: { color: '#1E293B', fontWeight: '700', fontSize: 15 },
  previewBox: { marginTop: 14, alignItems: 'center', gap: 10 },
  previewImg: { width: '100%', height: 220, borderRadius: 12 },
  switchPasteBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12
  },
  switchPasteText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    minHeight: 110,
    fontSize: 14,
    color: '#0F172A'
  },
  parseBtn: {
    marginTop: 12,
    backgroundColor: '#38BDF8',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center'
  },
  parseBtnText: { color: '#0C4A6E', fontWeight: '700', fontSize: 15 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  listTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  clearText: { fontSize: 13, fontWeight: '600', color: '#DC2626' },
  toggleText: { fontSize: 13, fontWeight: '600', color: '#0284C7' },
  emptyText: { fontSize: 14, color: '#64748B', fontStyle: 'italic' },
  groceryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7DD3FC'
  },
  groceryChipText: { fontSize: 14, fontWeight: '600', color: '#0C4A6E' },
  groceryChipX: { fontSize: 12, fontWeight: '700', color: '#0369A1' },
  stapleChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16
  },
  stapleChipText: { fontSize: 13, color: '#475569', fontWeight: '500' }
});
