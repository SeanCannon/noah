import * as SQLite from 'expo-sqlite';

import lootTable from '../../assets/data/lootTable.json';

export type LootItem = {
  id: number;
  name: string;
  gender: string;
  category: string;
  eats: string;    // JSON string in DB
  rarity: number;
};

export type LootCard = {
  image: string | number;
  title?: string;
  subtitle?: string;
  rarity?: number;
  ctaText?: string;
  sound?: string;
};

export const getRandomLoot = () => lootTable[Math.floor(Math.random() * lootTable.length)];

export const lootDb = SQLite.openDatabaseSync('app.db');

// Create table if not exists
lootDb.execSync(`
  CREATE TABLE IF NOT EXISTS qr_cache (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT
  );
`);

lootDb.execSync(`CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT,
  gender TEXT,
  category TEXT,
  eats TEXT,
  rarity INTEGER
);`);

export const saveNewLoot = (lootData: LootItem) => {
  const { id, name, gender, category, eats, rarity } = lootData;
  try {
    lootDb.runSync('INSERT INTO inventory (id, name, gender, category, eats, rarity) VALUES (?, ?, ?, ?, ?, ?)', [
      id,
      name,
      gender,
      category,
      JSON.stringify(eats),
      rarity
    ]);
    console.log('Loot saved for id:', id);
  } catch (err) {
    console.error('Failed to cache loot for id:', { key : id }, err);
    console.log('setting locked false in async catch');
  }
};

export const inferLootImageUrl = (lootData: LootItem) => {
  return `http://192.168.1.3:8000/output/a_${lootData?.gender}_${lootData?.name.replace(/\s/gi, '_')}.png`
}
