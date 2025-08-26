// LootPopup.tsx
import React, { useCallback } from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  GestureResponderEvent,
} from 'react-native';

import type { LootCard } from "@/services/loot";

type Props = {
  loot: LootCard | null;
  visible: boolean;
  onClose: () => void;
  onScrap: () => void;
  onPrimaryPress?: (e: GestureResponderEvent) => void;
};

/** Map a numeric rarity into a tier for UI. Adjust ranges as you like. */
function getRarityTier(score = 1) {
  // clamp
  const s = Math.max(1, Math.min(100, score));
  if (s >= 90) return { label: 'Legendary', color: '#a16207', bg: '#fef3c7' }; // gold
  if (s >= 75) return { label: 'Epic',      color: '#7c3aed', bg: '#ede9fe' }; // purple
  if (s >= 50) return { label: 'Rare',      color: '#0ea5e9', bg: '#e0f2fe' }; // blue
  if (s >= 25) return { label: 'Uncommon',  color: '#059669', bg: '#d1fae5' }; // green
  if (s >= 0) return  { label: 'Common',   color: '#475569', bg: '#e2e8f0' }; // slate/gray
  return              { label: 'Unknown',   color: '#ce23c9', bg: '#e2e8f0' }; // slate/gray
}

export default function LootPopup({ loot, visible, onClose, onPrimaryPress, onScrap }: Props) {
  const handlePrimaryPress = useCallback(
    (e: GestureResponderEvent) => {
      onPrimaryPress?.(e);
      // place future audio trigger here if desired
    },
    [onPrimaryPress]
  );

  if (!loot) return null;

  const source = typeof loot.image === 'string' ? { uri: loot.image } : loot.image;
  const rarity = loot.rarity ?? 1;
  const tier = getRarityTier(rarity);

  console.log('source = ', source);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="Close loot popup"
        />
        <View style={styles.dialog}>
          {(loot.title || loot.subtitle) && (
            <View style={styles.header}>
              {loot.title ? <Text style={styles.title}>{loot.title}</Text> : null}
              {loot.subtitle ? (
                <Text style={styles.subtitle} numberOfLines={2}>
                  {loot.subtitle}
                </Text>
              ) : null}
            </View>
          )}

          <View style={styles.imageSection}>
            {/* Rarity chip */}
            <View style={[styles.rarityChip, { backgroundColor: tier.bg, borderColor: tier.color }]}>
              <Text style={[styles.rarityText, { color: tier.color }]}>{tier.label}</Text>
              <Text style={[styles.rarityScore, { color: tier.color }]}>{rarity}</Text>
            </View>

            <TouchableOpacity
              onPress={handlePrimaryPress}
              activeOpacity={0.9}
              style={styles.imageWrapper}
              accessibilityRole="imagebutton"
              accessibilityLabel={loot.title || 'loot image'}
            >
              <Image source={source} style={styles.image} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          <Text style={styles.helperText}>
            {Platform.OS === 'ios'
              ? 'Tip: Tap the item to keep.'
              : 'Tip: Tap the item to keep.'}
          </Text>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>{loot.ctaText || 'Release'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={onScrap}>
            <Text style={styles.closeText}>{loot.ctaText || 'Butcher'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center',
  },
  dialog: {
    backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', width: '84%',
  },
  header: { width: '100%', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center', color: '#0f172a', textTransform: 'capitalize' },
  subtitle: { marginTop: 4, fontSize: 14, textAlign: 'center', color: '#475569', fontStyle: 'italic' },

  imageSection: { width: '100%' },
  imageWrapper: {
    width: '100%', aspectRatio: 1, marginBottom: 12, borderRadius: 8, overflow: 'hidden', backgroundColor: '#f1f5f9',
  },
  image: { width: '100%', height: '100%' },

  rarityChip: {
    position: 'absolute',
    zIndex: 2,
    right: 8,
    top: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rarityText: { fontWeight: '700', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  rarityScore: { marginLeft: 6, fontWeight: '700', fontSize: 12 },

  helperText: { color: '#475569', marginBottom: 12, textAlign: 'center' },
  closeBtn: { backgroundColor: '#1e293b', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  closeText: { color: 'white', fontWeight: '600' },
});
