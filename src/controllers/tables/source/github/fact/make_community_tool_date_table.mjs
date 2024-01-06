/**
 * @author Marcos Barrios
 * @since 02_01_2024
 * @description Make community-tool-date table.
 *
 */

'use strict';

import getAllToolSentiment from "../../../../scraper_use_cases/get_tool_sentiment.mjs";

// tool_score
// rank = NULL due to not having a rank at hand *** UPDATE README.MD REQUIRED ***
async function getAllToolInfoFromGithub(toolTable, githubId, idOfToday) {
  const allToolInfo = [];

  const allTotalSentiment = await getAllToolSentiment(toolTable);

  if (allTotalSentiment.length !== toolTable.length) {
    throw new Error('Detected difference between allSentimen length and ' +
        'tool table length, something is wrong.');
  }

  for (const [index, toolRecord] of toolTable.entries()) {
    const record = {
      community_id: githubId,
      tool_id: toolRecord.tool_id,
      date_id: idOfToday,
      tool_score: allTotalSentiment[index],
      rank: null
    }
    allToolInfo.push(record);
  }

  return allToolInfo;
}

const nameToAllInfo = {
  'github': getAllToolInfoFromGithub,
}

// originally this was going to be a single file for all communities
// thus this file structure.
// @todo May generate duplicates if called more than once. **Update README.md on change**
export default async function makeCommunityToolDateTable(toolTable, communityTable,
    idOfToday) {
  console.log('Calculating communityToolDateTable');

  const allRecord = [];

  try {
    const GITHUB_ID = communityTable.find(record => record.name === 'github')
        .community_id;
    const allInfoAtCommunity =
        await nameToAllInfo['github'](toolTable, GITHUB_ID, idOfToday);
    allInfoAtCommunity.forEach(record => allRecord.push(record));
  } catch (error) {
    console.error('There was an error while calculating ' + 
        'communityToolDateTable' + error);
  }

  return allRecord;
}
