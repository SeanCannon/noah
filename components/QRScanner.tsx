// app/components/QRScanner.tsx
import React, {useCallback, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import * as Crypto from 'expo-crypto';
import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
  type BarcodeType,
} from 'expo-camera';

import { getRandomLoot, lootDb } from "@/services/loot";

type Props = {
  onScanned: (payload: { data: string; type: BarcodeType }) => void;
  facing?: 'back' | 'front';
};

export default function QrScanner({onScanned, facing = 'back'}: Props) {
  const [permission, requestPermission] = useCameraPermissions();

  const handleScanned = useCallback(async (result: BarcodeScanningResult) => {
    console.log(`handling scanned for... ${JSON.stringify(result.data)}`)
    const key = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      result.data
    );

    // Check SQLite for existing record
    const cachedQrData = lootDb.getFirstSync<{ value: string }>(
      'SELECT value FROM qr_cache WHERE key = ?',
      [key]
    );

    if (cachedQrData) {
      const lootDataString = cachedQrData?.value;
      console.log('Found cached loot:', lootDataString);
      console.log('setting locked in cachedQrData');
      onScanned({ data : lootDataString, type : 'qr' });
    } else {
      const lootData = getRandomLoot();
      const lootDataString = JSON.stringify(lootData);

      console.log('Generated new loot:', lootData);
      console.log('setting locked in cachedQrData else');

      try {
        lootDb.runSync('INSERT INTO qr_cache (key, value) VALUES (?, ?)', [
          key,
          lootDataString,
        ]);
        console.log('Loot cached for key:', key);
      } catch (err) {
        console.warn('Failed to cache loot for key:', { key }, err);
      }
      onScanned({ data : lootDataString, type : 'qr' });
    }
  }, []);

  if (!permission) return <View style={styles.fill}/>;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>Camera access is required to scan QR codes.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.btn}>
          <Text style={styles.btnText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ ...styles.fill, borderStyle:'solid', borderColor:'red', borderWidth:8 }}>
      <CameraView
        style={{...styles.fill, height: 200}}
        facing={facing}
        // Restrict to QR for faster/cleaner scans
        barcodeScannerSettings={{
          barcodeTypes: ['qr']
        }}
        onBarcodeScanned={data => {
          if (!global.isScanning) {
            global.isScanning = true;
            return handleScanned(data);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16},
  msg: {textAlign: 'center', marginBottom: 12},
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#1e293b',
  },
  btnText: {color: 'white', fontWeight: '600'},
});
