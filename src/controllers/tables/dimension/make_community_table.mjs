/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @description Make community table.
 * 
 */

'use strict';

import { readFile, writeFile } from 'fs/promises';

export default async function makeCommunityTable() {
  const records = [
    {
      community_id: 1,
      name: 'github',
      type: 'Open Source Hosting',
    },
  ];

  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);
  persistentIds.community = 1;
  const TO_JSON = JSON.stringify(persistentIds, null, 2);
  await writeFile('./src/persistent_ids.json', TO_JSON);

  return records;
}

// makeCommunityTable().then((data) => console.log(data));
