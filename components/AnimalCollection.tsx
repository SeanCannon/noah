import React from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";

import type { LootItem } from "@/services/loot";

import { inferLootImageUrl } from '@/services/loot';

type Props = {
  capturedLoot: LootItem[];
};

const genderIcon = (gender:string) => {
  switch (gender) {
    case 'male':
      return '♂';
    case 'female':
      return '♀';
    default:
      return '⚥';
  }
}
export default function AnimalCollection({ capturedLoot }: Props) {
  console.log('capturedLoot = ', capturedLoot)
  if (!capturedLoot?.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No animals captured yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {capturedLoot?.map((loot, idx) => (
        <View key={`${loot.name}-${loot.gender}-${idx}`} style={styles.item}>
          <Image
            source={inferLootImageUrl(loot)}
            style={styles.image}
            contentFit="contain"
          />
          <Text style={styles.title}>{genderIcon(loot.gender)} {loot.name}</Text>
          <Text style={styles.rarity}>⭐ {loot.rarity}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    padding: 12,
  },
  item: {
    alignItems: "center",
    width: 100,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  title: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  rarity: {
    fontSize: 10,
    color: "#666",
  },
  empty: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
  },
});
