/**
 * @author Marcos Barrios
 * @since 03_11_2023
 * @description Make market table.
 *
 */

'use strict';

import { readFile, writeFile } from 'fs/promises';

export default async function makeMarketTable() {
  const table = [];

  const markets = [
    'europe',
    'united states',
    'asia',
  ];

  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);

  persistentIds.market = 0;
  for (const _ of markets) {
    persistentIds.market++;
    table.push({
      market_id: persistentIds.market,
    });
  }

  const TO_JSON = JSON.stringify(persistentIds, null, 2);
  await writeFile('./src/persistent_ids.json', TO_JSON);

  return table;
}
