import React, {useState} from "react";
import {Image} from 'expo-image';
import {Platform, StyleSheet} from 'react-native';
import list from 'humanize-list';

import {HelloWave} from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import QrScanner from '@/components/QRScanner';
import LootPopup from "@/components/LootPopup";
import AnimalCollection from "@/components/AnimalCollection";
import { useCapturedLoot } from "@/hooks/useCapturedLoot";
import { saveNewLoot, inferLootImageUrl } from "@/services/loot";

import type { LootItem } from "@/services/loot";

export default function HomeScreen() {
  const [lootProspect, setLootProspect] = useState<LootItem>();
  const capturedLoot = useCapturedLoot(lootProspect);

  const maybePluralize = (s: string) => {
    const pluralMap: Record<string, string> = {
      leaf: 'leaves',
      carrion: 'carrion',
      grass: 'grass',
      nectar: 'nectar'
    };

    return pluralMap[s] ?? `${s}s`;
  };

  const addDescriptiveContext = (s: string) => {
    return s.replace('medium', 'medium-sized')
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{light: '#A1CEDC', dark: '#1D3D47'}}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave/>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        {
          (lootProspect || global.isScanning) ? null : (
            <QrScanner
              onScanned={({ data, type }) => {
                if (data) {
                  try {
                    setLootProspect(JSON.parse(data));
                  } catch (err) {
                    console.error('could not JSON parse onScanned data', { err, data, type, dataType : typeof data });
                    setLootProspect(undefined);
                  }
                }
              }}
            />
          )
        }
        {
          lootProspect ? (
              <LootPopup
                visible={!!lootProspect}
                onScrap={() => {
                  // todo save meat to inventory
                  global.isScanning = false;
                  setLootProspect(undefined);
                }}
                onClose={() => {
                  global.isScanning = false;
                  setLootProspect(undefined);
                }}
                loot={{
                  image: inferLootImageUrl(lootProspect),
                  title: `${lootProspect?.gender} ${lootProspect?.name}`,
                  subtitle: `This ${addDescriptiveContext(lootProspect?.category)} eats ${list(lootProspect?.eats?.map(maybePluralize).map(addDescriptiveContext))}`,
                  rarity: lootProspect?.rarity || 100, // 1–100
                  //sound : `https://flatology.com/farts/audio/mp3/${lootProspect?.filename}.mp3`
                }}
                onPrimaryPress={() => {
                  // later: animate, collect, or play a sound
                  saveNewLoot(lootProspect);
                  global.isScanning = false;
                  setLootProspect(undefined);
                }}
              />
          ) : null
        }
        <AnimalCollection capturedLoot={capturedLoot} />
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
