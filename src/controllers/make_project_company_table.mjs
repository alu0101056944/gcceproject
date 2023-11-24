/**
 * @author Marcos Barrios
 * @since 09_11_2023
 * @desc Make project company table
 */

'use strict';

import makeToolsTableWithoutIdFromGithubExploreScrapper from './scrapper_usages/make_tools_from_github_explore.mjs'

import getCommitAmount from '../routes/get_repository_commit_amount.mjs';

import { inspect } from 'util';

async function getContributorAmount(authorCompany, name) {
  const API_URL =
      `https://api.github.com/repos/${authorCompany}/${name}/contributors`;
  const response = await fetch(API_URL);
  const allContributors = await response.json();
  return allContributors.length;
}

function getInfoFromScrapper() {
  const specializations = [
    'frontend',
    // 'backend',
    // 'embedded',
    // 'devops',
  ];
  const { repoNameToURL } =
      await makeToolsTableWithoutIdFromGithubExploreScrapper(specializations);

  const allRelation = [];
  const allUniqueRepoName = new Set();
  const allUniqueAuthorCompany = new Set();
  for (const url of Object.getOwnPropertyNames(repoNameToURL)) {
    const [ _, AUTHOR_COMPANY, NAME ] = /github.com\/(.*?)\/(.*?)\//.exec(url);
    allRelation.push({
          authorCompany: AUTHOR_COMPANY,
          name: NAME,
        });
    allUniqueRepoName.add(NAME);
    allUniqueAuthorCompany.add(AUTHOR_COMPANY);
  }

  return { allRelation, allUniqueRepoName, allUniqueAuthorCompany };
}

// assumes companyTable names are github compatible names (without spaces)
export default async function makeProjectCompanyTable(companyTable, projectTable) {
  const {
        allRelation,
        allUniqueRepoName,
        allUniqueAuthorCompany
      } = getInfoFromScrapper();

  const authorCompanyToId = {};
  for (const companyRecord of companyTable) {
    if (allUniqueAuthorCompany.has(companyRecord.name)) {
      authorCompanyToId[companyRecord.name] = companyRecord.name;
    } else {
      authorCompanyToId[companyRecord.name] = null;
    }
  }

  const repoNameToId = {};
  for (const projectRecord of projectTable) {
    if (allUniqueRepoName.has(projectRecord.project_name)) {
      repoNameToId[projectRecord.project_name] = projectRecord.project_id;
    } else {
      repoNameToId[projectRecord.project_name] = null;
    }
  }

  const allCommitAmount = getCommitAmount(allRelation);

  const projectCompanyTable = [];
  for (let i = 0; i < allRelation.length; i++) {
    const REPO_NAME = allRelation[i].name;
    const AUTHOR_COMPANY_NAME = allRelation[i].authorCompany;

    const PROJECT_CONTRIBUTOR_AMOUNT =
        getContributorAmount(AUTHOR_COMPANY_NAME, REPO_NAME);

    const AVERAGE_INCOME_PER_HOUR = 37;
    const ARBITRARY_PROJECT_DURATION_IN_YEARS = 5;
    const BUDGET_ESTIMATED =
        PROJECT_CONTRIBUTOR_AMOUNT * AVERAGE_INCOME_PER_HOUR *
        ARBITRARY_PROJECT_DURATION_IN_YEARS;

    projectCompanyTable.push({
      project_id: repoNameToId[REPO_NAME],
      company_id: authorCompanyToId[AUTHOR_COMPANY_NAME],
      budget: BUDGET_ESTIMATED,
      // @todo: missing amount of employeees
    });
  }

  return projectCompanyTable;
};
