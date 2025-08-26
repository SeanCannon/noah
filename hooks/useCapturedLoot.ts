// hooks/useCapturedLoot.ts
import { useState, useEffect } from "react";

import { lootDb } from "@/services/loot";
import type { LootItem } from "@/services/loot";

export function useCapturedLoot(lootProspect: LootItem) {
  const [loot, setLoot] = useState<LootItem[]>([]);

  useEffect(() => {
    lootDb.getAllAsync('SELECT * FROM inventory', [])
      .then(result => {
        console.log('result = ', result);
        const data = result as LootItem[];
        console.log('setting loot...', data);
        setLoot(data);
      })
      .catch(error => {
        console.error("Error reading loot:", error);
        return false;
      });
  }, [lootProspect]);

  return loot?.map(item => ({
    ...item,
    eats: JSON.parse(item.eats) as string[],
  }));
}
