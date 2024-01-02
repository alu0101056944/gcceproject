/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @description Make community table.
 * 
 * Make community table is not dynamic because on must know what the relevant
 * communities are. In this program, a community is considered a webpage with
 * information about tools, and which communities are relevant must be known
 * beforehand because each requires specific scrapers.
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
