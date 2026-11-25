import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { CUISINES, DIET_OPTIONS } from '../utils/planner';

export default function Step2Cuisines({
  selectedCuisines,
  onToggleCuisine,
  onSelectAllCuisines,
  profiles,
  onChangeProfiles
}) {
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [allergyDraft, setAllergyDraft] = useState('');

  const allSelected = selectedCuisines.length === CUISINES.length;

  const addProfile = () => {
    const next = [...profiles, { name: `Person ${profiles.length + 1}`, dietaryFlags: [], allergies: [] }];
    onChangeProfiles(next);
    setExpandedIdx(next.length - 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const updateProfile = (idx, patch) => {
    const next = profiles.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    onChangeProfiles(next);
  };

  const removeProfile = (idx) => {
    const next = profiles.filter((_, i) => i !== idx);
    onChangeProfiles(next);
    setExpandedIdx(null);
  };

  const toggleFlag = (idx, flagId) => {
    const profile = profiles[idx];
    if (flagId === 'no-restrictions') {
      updateProfile(idx, { dietaryFlags: [] });
      return;
    }
    const exists = profile.dietaryFlags.includes(flagId);
    const flags = exists
      ? profile.dietaryFlags.filter((f) => f !== flagId)
      : [...profile.dietaryFlags, flagId];
    updateProfile(idx, { dietaryFlags: flags });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const addAllergy = (idx) => {
    const val = allergyDraft.trim().toLowerCase();
    if (!val) return;
    const profile = profiles[idx];
    if (!profile.allergies.includes(val)) {
      updateProfile(idx, { allergies: [...profile.allergies, val] });
    }
    setAllergyDraft('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What are you in the mood for?</Text>
      <Text style={styles.subtitle}>Pick cuisines & household dietary needs</Text>

      {/* Dietary Profiles Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>👨‍👩‍👧‍👦 Dietary Profiles</Text>
          <TouchableOpacity style={styles.addProfileBtn} onPress={addProfile}>
            <Text style={styles.addProfileText}>+ Add Person</Text>
          </TouchableOpacity>
        </View>

        {profiles.length === 0 ? (
          <Text style={styles.hintText}>No dietary restrictions? All recipes will be included.</Text>
        ) : (
          <View style={{ gap: 10 }}>
            {profiles.map((p, idx) => {
              const isOpen = expandedIdx === idx;
              return (
                <View key={idx} style={styles.profileBox}>
                  <TouchableOpacity
                    style={styles.profileHeader}
                    onPress={() => setExpandedIdx(isOpen ? null : idx)}
                  >
                    <View style={styles.profileNameRow}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{(p.name || 'P')[0].toUpperCase()}</Text>
                      </View>
                      <View>
                        <Text style={styles.profileName}>{p.name}</Text>
                        <Text style={styles.profileSummary}>
                          {p.dietaryFlags.length ? p.dietaryFlags.join(', ') : 'No restrictions'}
                          {p.allergies.length ? ` • 🚫 ${p.allergies.join(', ')}` : ''}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
                  </TouchableOpacity>

                  {isOpen && (
                    <View style={styles.profileEditor}>
                      <View style={styles.nameEditRow}>
                        <TextInput
                          style={styles.nameInput}
                          value={p.name}
                          onChangeText={(txt) => updateProfile(idx, { name: txt })}
                          placeholder="Person name"
                        />
                        <TouchableOpacity style={styles.removeBtn} onPress={() => removeProfile(idx)}>
                          <Text style={styles.removeBtnText}>Remove</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.chipWrap}>
                        {DIET_OPTIONS.map((opt) => {
                          const selected =
                            opt.id === 'no-restrictions'
                              ? p.dietaryFlags.length === 0
                              : p.dietaryFlags.includes(opt.id);
                          return (
                            <TouchableOpacity
                              key={opt.id}
                              style={[styles.dietChip, selected && styles.dietChipSelected]}
                              onPress={() => toggleFlag(idx, opt.id)}
                            >
                              <Text style={[styles.dietChipText, selected && styles.dietChipTextSelected]}>
                                {opt.emoji} {opt.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      <Text style={styles.allergyTitle}>🚫 Allergies (hard-excluded):</Text>
                      <View style={styles.allergyRow}>
                        <TextInput
                          style={styles.allergyInput}
                          placeholder="e.g. peanut, shrimp..."
                          placeholderTextColor="#6B7280"
                          value={allergyDraft}
                          onChangeText={setAllergyDraft}
                          onSubmitEditing={() => addAllergy(idx)}
                        />
                        <TouchableOpacity style={styles.allergyAddBtn} onPress={() => addAllergy(idx)}>
                          <Text style={styles.allergyAddText}>Add</Text>
                        </TouchableOpacity>
                      </View>

                      {p.allergies.length > 0 && (
                        <View style={[styles.chipWrap, { marginTop: 8 }]}>
                          {p.allergies.map((a) => (
                            <TouchableOpacity
                              key={a}
                              style={styles.allergyTag}
                              onPress={() =>
                                updateProfile(idx, { allergies: p.allergies.filter((x) => x !== a) })
                              }
                            >
                              <Text style={styles.allergyTagText}>{a} ✕</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Select All Toggle */}
      <View style={styles.cuisineBar}>
        <Text style={styles.countText}>
          {selectedCuisines.length} cuisine{selectedCuisines.length === 1 ? '' : 's'} selected
        </Text>
        <TouchableOpacity
          style={styles.toggleAllBtn}
          onPress={() => {
            onSelectAllCuisines(!allSelected);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.toggleAllText}>{allSelected ? 'Deselect All' : 'Select All'}</Text>
        </TouchableOpacity>
      </View>

      {/* 2-Column Cuisine Grid */}
      <View style={styles.grid}>
        {CUISINES.map((c) => {
          const selected = selectedCuisines.includes(c.id);
          return (
            <TouchableOpacity
              key={c.id}
              activeOpacity={0.78}
              style={[
                styles.cuisineCard,
                selected && { borderColor: c.color, backgroundColor: '#F0F9FF' }
              ]}
              onPress={() => {
                onToggleCuisine(c.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              {selected && (
                <View style={[styles.checkBadge, { backgroundColor: c.color }]}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
              <Text style={styles.emoji}>{c.emoji}</Text>
              <Text style={styles.cuisineName}>{c.name}</Text>
              <Text style={styles.cuisineDesc} numberOfLines={2}>
                {c.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14 },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#475569', textAlign: 'center', marginBottom: 2 },
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  addProfileBtn: { backgroundColor: '#E0F2FE', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16 },
  addProfileText: { color: '#0369A1', fontWeight: '700', fontSize: 13 },
  hintText: { fontSize: 13, color: '#64748B' },
  profileBox: { backgroundColor: '#F8FAFC', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  profileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  profileNameRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#38BDF8', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#0C4A6E', fontWeight: '800', fontSize: 15 },
  profileName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  profileSummary: { fontSize: 12, color: '#64748B', marginTop: 1 },
  chevron: { fontSize: 12, color: '#64748B', paddingLeft: 8 },
  profileEditor: { padding: 12, paddingTop: 0, gap: 10 },
  nameEditRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  nameInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14
  },
  removeBtn: { backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  removeBtnText: { color: '#B91C1C', fontWeight: '700', fontSize: 12 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dietChip: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
  dietChipSelected: { backgroundColor: '#0284C7', borderColor: '#0284C7' },
  dietChipText: { fontSize: 12, color: '#334155', fontWeight: '600' },
  dietChipTextSelected: { color: '#FFFFFF' },
  allergyTitle: { fontSize: 12, fontWeight: '700', color: '#991B1B', marginTop: 4 },
  allergyRow: { flexDirection: 'row', gap: 8 },
  allergyInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13
  },
  allergyAddBtn: { backgroundColor: '#EF4444', borderRadius: 10, paddingHorizontal: 14, justifyContent: 'center' },
  allergyAddText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  allergyTag: { backgroundColor: '#FEE2E2', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 },
  allergyTagText: { color: '#991B1B', fontSize: 12, fontWeight: '600' },
  cuisineBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 },
  countText: { fontSize: 14, fontWeight: '700', color: '#334155' },
  toggleAllBtn: { backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#CBD5E1' },
  toggleAllText: { fontSize: 13, fontWeight: '700', color: '#0369A1' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  cuisineCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  emoji: { fontSize: 34, marginBottom: 6 },
  cuisineName: { fontSize: 15, fontWeight: '700', color: '#0F172A', textAlign: 'center' },
  cuisineDesc: { fontSize: 11, color: '#64748B', textAlign: 'center', marginTop: 3 }
});
