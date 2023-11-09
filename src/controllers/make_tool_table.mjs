/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @description Make tool table.
 * 
 */

'use strict';

import { readFile, writeFile } from 'fs/promises'

import makeToolsFromGithubExplore from './scrapper_usages/make_tools_from_github_explore.mjs';

// import { inspect } from 'util';

export default async function makeToolTable() {
  const { tableObject } = await makeToolsFromGithubExplore(['frontend']);
  let toolId = 1;
  tableObject.forEach(record => record.tool_id = toolId++);

  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);
  persistentIds.tool = tableObject.length;
  const TO_JSON = JSON.stringify(persistentIds, null, 2);
  await writeFile('./src/persistent_ids.json', TO_JSON);

  return tableObject;
}

// makeToolTable().then((data) => console.log(inspect(data)));
