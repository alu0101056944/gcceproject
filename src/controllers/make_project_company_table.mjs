/**
 * @author Marcos Barrios
 * @since 09_11_2023
 * @desc Make project company table
 */

'use strict';

import makeToolsFromGithubExplore from './scrapper_usages/make_tools_from_github_explore.mjs'

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
  const { urlsObject } = (await makeToolsFromGithubExplore(specializations));

  const names = new Set();
  const author_companies = new Set();
  for (const url of Object.getOwnPropertyNames(urlsObject)) {
    const [ _, AUTHOR_COMPANY, NAME ] = /github.com\/(.*?)\/(.*?)\//.exec(url);
    names.add(NAME);
    author_companies.add(AUTHOR_COMPANY);
  }

  const authorCompaniesIdAndName = []; // All I use is the index later, so not obj.
  for (const companyObject of companyTable) {
    if (author_companies.has(companyObject.name)) {
      authorCompaniesIdAndName.push(
        { // I need the name later so push object.
          company_id: companyObject.company_id,
          name: companyObject.name,
        });
    } else {
      authorCompaniesIdAndName.push(null);
    }
  }

  const namesIds = {};
  for (const projectInfo of projectTable) {
    if (names.has(projectInfo.project_name)) {
      namesIds[projectInfo.project_name] = projectInfo.project_id;
    } else {
      namesIds[projectInfo.project_name] = null;
    }
  }

  // WIP: maeke the input for the getCommitAmount function.

  const allCommitAmount =
      getCommitAmount(names.map(name => {
            return {
              authorCompany: 
            };
          }));

  const projectCompanyTable = [];
  if (names.length != author_companies.length) {
    throw new Error('Error when extracting author/name repo from url;' +
      'different lengths')
  }
  for (const [index, name] of names.entries()) {
    const allProjectContributors =
        await getContributorAmount(authorCompaniesIdAndName[index].name, name);

    projectCompanyTable.push({
        project_id: namesIds[name],
        company_id: authorCompaniesIdAndName[index].company_id,
        budget: 
      });
  }

  // needs amount of employees assigned.

  return projectCompanyTable;
};
