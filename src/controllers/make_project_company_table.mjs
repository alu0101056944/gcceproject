/**
 * @author Marcos Barrios
 * @since 09_11_2023
 * @desc Make project company table
 */

'use strict';

import makeToolsFromGithubExplore from './scrapper_usages/make_tools_from_github_explore.mjs'

import { inspect } from 'util';

// assumes companyTable names are github compatible names (without spaces)
export default async function makeProjectCompany(companyTable, projectTable) {
  const specializations = [
    'frontend',
    // 'backend',
    // 'embedded',
    // 'devops',
  ];
  const { urlsObject } = (await makeToolsFromGithubExplore(specializations));
  
  const nameAuthorPairs = [];
  for (const url of Object.getOwnPropertyNames(urlsObject)) {
    const [ _, author_company, name ] = /github.com\/(.*?)\/(.*?)\//.exec(url);
    nameAuthorPairs.push({ author_company, name });
  }

  for (const pairObject of nameAuthorPairs) {

    const project_id = url

  }
};

