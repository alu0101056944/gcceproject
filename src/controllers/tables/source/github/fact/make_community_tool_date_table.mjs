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
async function getAllToolInfoFromGithub(toolTable, idOfToday) {
  const allToolInfo = [];

  const allTotalSentiment = await getAllToolSentiment(toolTable);

  if (allTotalSentiment.length !== toolTable.length) {
    throw new Error('Detected difference between allSentimen length and ' +
        'tool table length, something is wrong.');
  }

  for (const [index, toolRecord] of toolTable.entries()) {
    const record = {
      community_id: 1, // github's id in the make community table file
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

export default async function makeCommunityToolDateTable(communityTable,
    toolTable, idOfToday) {
  if (Object.getOwnPropertyNames(nameToAllInfo).length !== communityTable.length) {
    throw new Error('There are communities without URL function associated. ' +
        'Please, add one.');
  }
  const allRecord = [];

  for (const community of communityTable) {
    const allInfoAtCommunity =
        await nameToAllInfo[community.name](toolTable, idOfToday);
    allInfoAtCommunity.forEach(record => allRecord.push(record));
  }

  return allRecord;
}
