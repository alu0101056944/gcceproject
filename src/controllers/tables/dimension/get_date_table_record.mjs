/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @description Make date table.
 * 
 */

'use strict';

import { readFile, writeFile } from 'fs/promises'

export default async function getNewDateRecord() {
  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);

  const LAST_UPDATE_DATE = persistentIds.date?.lastUpdateDate;
  if (!LAST_UPDATE_DATE) {
    throw new Error("Persistent id's date is structured incorrectly.");
  }
  console.log(LAST_UPDATE_DATE.match(/\d\d\d\d-\d\d-\d\d/));
  if (!LAST_UPDATE_DATE.match(/\d\d\d\d-\d\d-\d\d/)) {
    throw new Error("Persistent id date's lastUpdateDate has incorrect format.");
  }
  const lastUpdateDate =
      persistentIds.date.lastUpdateDate === '0000-00-00' ?
          null :
          new Date(persistentIds.date.lastUpdateDate);

  const todayDate = new Date();

  async function writePersistentIds() {
    const TO_JSON = JSON.stringify(persistentIds, null, 2);
    await writeFile('./src/persistent_ids.json', TO_JSON);
  }

  lastUpdateDate?.setHours(0, 0, 0, 0);
  todayDate.setHours(0, 0, 0, 0);
  if (!lastUpdateDate || lastUpdateDate < todayDate) {
    ++persistentIds.date.id;
    persistentIds.date.lastUpdateDate = new Date();
    persistentIds.date.lastUpdateDate.setHours(0, 0, 0, 0);
    const dateRecord = {
      date_id: persistentIds.date.id,
      date: persistentIds.date.lastUpdateDate,
    }
    await writePersistentIds();
    return dateRecord;
  }

  const dateRecord = {
    date_id: persistentIds.date.id,
    date: lastUpdateDate,
  }
  await writePersistentIds();
  return dateRecord;
}

console.log((await getNewDateRecord()));
