/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @description Make tool table.
 * 
 */

'use strict';

import { readFile, writeFile } from 'fs/promises'

import makeToolsFromGithubExplore from './scrapper_usages/add_tool_entries_to_table.mjs';

// import { inspect } from 'util';

export default async function makeToolTable() {
  const records = await makeToolsFromGithubExplore([
        'frontend'
      ]);
  let toolId = 1;
  records.forEach(record => record.tool_id = toolId++);

  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);
  persistentIds.tool = records.length;
  const TO_JSON = JSON.stringify(persistentIds, null, 2);
  await writeFile('./src/persistent_ids.json', TO_JSON);

  return records;
}

// makeToolTable().then((data) => console.log(inspect(data)));
