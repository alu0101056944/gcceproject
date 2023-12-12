/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @description Make tool table.
 * 
 */

'use strict';

import { readFile, writeFile } from 'fs/promises'

import makeToolsTableWithoutIdFromGithubExploreScraper from '../../scraper_use_cases/make_tools_from_github_explore.mjs';

export default async function makeToolTable() {
  const { allRecord } =
      await makeToolsTableWithoutIdFromGithubExploreScraper(['frontend']);
  let toolId = 1;
  allRecord.forEach(record => record.tool_id = toolId++);

  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);
  persistentIds.tool = allRecord.length;
  const TO_JSON = JSON.stringify(persistentIds, null, 2);
  await writeFile('./src/persistent_ids.json', TO_JSON);

  return allRecord;
}

// makeToolTable().then((data) => console.log(inspect(data)));
