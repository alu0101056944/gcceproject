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

import countDiscussionAmount from '../../../../scraper_use_cases/get_discussions_amount.mjs';
import getAllIssueAmountsObject from '../../../../scraper_use_cases/get_issues_of_repo.mjs';

async function getCommitAmount(partialURL) {
  const authorAndRepoName = partialURL.split('/');
  const AUTHOR_COMPANY = authorAndRepoName[0];
  const REPO_NAME = authorAndRepoName[1];
  const URL =
      `https://api.github.com/repos/${AUTHOR_COMPANY}/${REPO_NAME}/commits?per_page=1&page=1`;
  const response = await fetch(URL, {
    headers: {
      'User-Agent': 'Our script',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    }
  });
  
  const NEXT_AND_LAST_TEXT = response.headers.get('Link');
  /**
   * Example:
   * '
   * <https://api.github.com/repositories/10270250/commits?per_page=1&page=2>; rel="next",
   * <https://api.github.com/repositories/10270250/commits?per_page=1&page=16134>; rel="last"
   * '
   */

  const LAST_URL_REG_EXP = /<([^\s]+?page=(\d+))>; rel="last"/;
  const regExpResult = LAST_URL_REG_EXP.exec(NEXT_AND_LAST_TEXT);
  const COMMIT_AMOUNT = regExpResult[2];
  return parseInt(COMMIT_AMOUNT);
}

async function getAllToolInfoFromGithub(toolTable, idOfGithubCommunity) {
  const allToolInfo = [];

  const allPartialURL =
      toolTable.map(tool => `${tool.author_company}/${tool.name}`);
  const partialURLToAmountsObject =
      await getAllIssueAmountsObject(allPartialURL);

  const partialURLToCommitAmount = {};
  for (const partialURL of allPartialURL) {
    partialURLToCommitAmount[partialURL] = await getCommitAmount(partialURL);
  }

  const repoNameToDiscussionAmount =
      await countDiscussionAmount(toolTable.map(tool => tool.name));

  const hasUnexpectedLength =
    (obj) => Object.getOwnPropertyNames(obj).length !== toolTable.length;
  if (hasUnexpectedLength(partialURLToAmountsObject)) {
    console.log('Detected length discrepancy between toolTable and ' +
        'partialURLToAmountsObject');
    for (const partialURL of allPartialURL) {
      partialURLToAmountsObject[partialURL] ??= null;
    }
  }
  if (hasUnexpectedLength(repoNameToDiscussionAmount)) {
    console.log('Detected length discrepancy between toolTable and ' +
        'repoNameToDiscussionAmount');
    for (const partialURL of allPartialURL) {
      const REPO_NAME = partialURL.split('/')[1];
      repoNameToDiscussionAmount[REPO_NAME] ??= null;
    }
  }
  if (hasUnexpectedLength(partialURLToCommitAmount)) {
    console.log('Detected length discrepancy between toolTable and ' +
        'partialURLToCommitAmount');
    for (const partialURL of allPartialURL) {
      partialURLToCommitAmount[partialURL] ??= null;
    }
  }

  for (const toolRecord of toolTable) {
    const PARTIAL_URL = `${toolRecord.author_company}/${toolRecord.name}`;
    const REPO_NAME = PARTIAL_URL.split('/')[1];
    const record = {
      community_id: idOfGithubCommunity,
      tool_id: toolRecord.tool_id,
      amount_of_bugs_reported: partialURLToAmountsObject[PARTIAL_URL].total,
      amount_of_bugs_solved: partialURLToAmountsObject[PARTIAL_URL].closed,
      amount_of_changes_commited: partialURLToCommitAmount?.[PARTIAL_URL] ?? null,
      amount_of_discussions: repoNameToDiscussionAmount?.[REPO_NAME] ?? null,
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
export default async function makeCommunityToolTable(toolTable,
      idOfGithubCommunity) {
  console.log('Calculating communityToolTable');

  const allRecord = [];

  try {
    const allInfoAtCommunity =
        await (nameToAllInfo['github'](toolTable, idOfGithubCommunity));
    allInfoAtCommunity.forEach(record => allRecord.push(record));
  } catch (error) {
    console.error('There was an error while calculating ' + 
        'communityToolTable' + error);
  }

  return allRecord;
}
