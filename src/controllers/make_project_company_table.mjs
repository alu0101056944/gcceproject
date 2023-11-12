/**
 * @author Marcos Barrios
 * @since 09_11_2023
 * @desc Make project company table
 */

'use strict';

import makeToolsFromGithubExplore from './scrapper_usages/make_tools_from_github_explore.mjs'

import { inspect } from 'util';

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

  const authorCompanyIds = {};
  for (const companyObject of companyTable) {
    if (author_companies.has(companyObject.name)) {
      authorCompanyIds[companyObject.author_company] = companyObject.company_id;
    } else {
      authorCompanyIds[companyObject.name] = null;
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

  const projectCompanyTable = [];
  if (names.length != author_companies.length) {
    throw new Error('Error when extracting author/name repo from url;' +
      'different lengths')
  }
  const allAuthorCompanyIds = Array.from(authorCompanyIds);
  names.forEach((name, i) => {
        projectCompanyTable.push({
              project_id: namesIds[name],
              company_id: allAuthorCompanyIds[i],
            });
      });

  // needs budget

  // needs amount of employees assigned.

  return projectCompanyTable;
};
