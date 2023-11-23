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

// assumes companyTable names are github compatible names (without spaces)
export default async function makeProjectCompanyTable(companyTable, projectTable) {
  const specializations = [
    'frontend',
    // 'backend',
    // 'embedded',
    // 'devops',
  ];
  const { repoNameToURL } =
      (await makeToolsTableWithoutIdFromGithubExploreScrapper(specializations));

  const allRepoName = new Set();
  const allAuthorCompany = new Set();
  for (const url of Object.getOwnPropertyNames(repoNameToURL)) {
    const [ _, AUTHOR_COMPANY, NAME ] = /github.com\/(.*?)\/(.*?)\//.exec(url);
    allRepoName.add(NAME);
    allAuthorCompany.add(AUTHOR_COMPANY);
  }

  const allAuthorCompanyIdAndName = []; // All I use is the index later, so not obj.
  for (const companyRecord of companyTable) {
    if (allAuthorCompany.has(companyRecord.name)) {
      allAuthorCompanyIdAndName.push(
        { // I need the name later so push object.
          company_id: companyRecord.company_id,
          name: companyRecord.name,
        });
    } else {
      allAuthorCompanyIdAndName.push(null);
    }
  }

  const repoNameToId = {};
  for (const projectRecord of projectTable) {
    if (allRepoName.has(projectRecord.project_name)) {
      repoNameToId[projectRecord.project_name] = projectRecord.project_id;
    } else {
      repoNameToId[projectRecord.project_name] = null;
    }
  }

  const allCommitAmount =
      getCommitAmount(allRepoName.map((name, index) => {
            return {
              authorCompany: authorCompaniesIdAndName[index].name,
              name,
            };
          }));

  const projectCompanyTable = [];
  if (allRepoName.length != allAuthorCompany.length) {
    throw new Error('Error when extracting author/name repo from url;' +
      'different lengths')
  }
  for (const [index, name] of names.entries()) {
    const allProjectContributors =
        await getContributorAmount(authorCompaniesIdAndName[index].name, name);
    

    projectCompanyTable.push({
        project_id: repoNameToId[name],
        company_id: authorCompaniesIdAndName[index].company_id,
        budget: allProjectContributors.length * 
      });
  }

  // needs amount of employees assigned.

  return projectCompanyTable;
};
