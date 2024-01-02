/**
 * @author Marcos Barrios
 * @since 02_01_2024
 * @description Make community_tool table.
 *
 * Each community would be a different url, and because each tool URL is assumed
 *    to be made up of the tool name and optionally an author like in github then
 *    each community will have associated a function that receives the tool records
 *    and returns an array of information object to complement the community-tool
 *    table with.
 *
 */

'use strict';

import countDiscussionAmount from '../../scraper_use_cases/get_discussions_amount.mjs';
import fetchAllCommitAmount from '../../scraper_use_cases/get_repository_commit_amount.mjs';
import getAllIssueAmountsObject from '../../scraper_use_cases/get_issues_of_repo.mjs';

// amount_of_bugs_reported integer,
// amount_of_bugs_solved integer,
// amount_of_changes_commited integer,
// amount_of_discussions integer
async function getAllToolInfoFromGithub(toolTable) {
  const allToolInfo = [];

  const allPartialURL =
      toolTable.map(tool => `${tool.author_company}/${tool.name}`);
  const partialURLToAmountsObject =
      await getAllIssueAmountsObject(allPartialURL);
  const partialURLToCommitAmount = await fetchAllCommitAmount(toolTable);
  const partialURLToDiscussionAmount =
      await countDiscussionAmount(toolTable.map(tool => tool.name));

  const hasUnexpectedLength =
    (obj) => Object.getOwnPropertyNames(obj).length !== toolTable.length;
  if (hasUnexpectedLength(partialURLToAmountsObject) ||
      hasUnexpectedLength(partialURLToDiscussionAmount) ||
      hasUnexpectedLength(partialURLToCommitAmount)) {
    throw new Error('There is disparity between partial results and toolTable.' +
        ' Something is off');
  }

  for (const [index, toolRecord] of toolTable.entries()) {
    const PARTIAL_URL = `${toolRecord.author_company}/${toolRecord.name}`;
    const record = {
      community_id: 1, // github's id in the make community table file
      tool_id: toolRecord.tool_id,
      amount_of_bugs_reported: partialURLToAmountsObject[PARTIAL_URL].total,
      amount_of_bugs_solved: partialURLToAmountsObject[PARTIAL_URL].closed,
      amount_of_changes_commited: partialURLToCommitAmount[PARTIAL_URL],
      amount_of_discussions: partialURLToDiscussionAmount[PARTIAL_URL],
    }
    allToolInfo.push(record);
  }

  return allToolInfo;
}

const nameToAllInfo = {
  'github': getAllToolInfoFromGithub,
}

export default async function makeCommunityToolTable(toolTable, communityTable) {
  if (Object.getOwnPropertyNames(nameToAllInfo).length !== communityTable.length) {
    throw new Error('There are communities without URL function associated. ' +
        'Please, add one.');
  }
  
  const allRecord = [];

  for (const community of communityTable) {
    const allInfoAtCommunity = await nameToAllInfo[community.name](toolTable);
    allInfoAtCommunity.concat(allInfoAtCommunity);
  }

  return allRecord;
}
