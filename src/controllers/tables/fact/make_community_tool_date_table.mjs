/**
 * @author Marcos Barrios
 * @since 02_01_2024
 * @description Make community-tool-date table.
 *
 */

'use strict';

// tool_score
// rank = NULL due to not having a rank at hand *** UPDATE README.MD REQUIRED ***
async function getAllToolInfoFromGithub(toolTable, idOfToday) {
  const allToolInfo = [];

  const allPartialURL =
      toolTable.map(tool => `${tool.author_company}/${tool.name}`);

  for (const [index, toolRecord] of toolTable.entries()) {
    const PARTIAL_URL = `${toolRecord.author_company}/${toolRecord.name}`;
    const record = {
      community_id: 1, // github's id in the make community table file
      tool_id: toolRecord.tool_id,
      date_id: idOfToday,
      // tool_score
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
    allInfoAtCommunity.concat(allInfoAtCommunity);
  }

  return allRecord;
}
