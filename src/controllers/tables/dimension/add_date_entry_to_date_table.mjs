/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @description Make date table.
 * 
 */

'use strict';

import { readFile, writeFile } from 'fs/promises'


// import { inspect } from 'util';

export default async function getnewDateRecord() {
  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);

  ++persistentIds.date;
  const dateRecord = {
    date_id: persistentIds.date,
    date: new Date(),
  };

  const TO_JSON = JSON.stringify(persistentIds, null, 2);
  await writeFile('./src/persistent_ids.json', TO_JSON);

  return dateRecord;
}

// console.log((await getnewDateRecord()));
