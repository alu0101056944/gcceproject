/**
 * @author Marcos Barrios
 * @since 01_11_2023
 * @description Make project table.
 *
 */

'use strict';

import { readFile, writeFile } from 'fs/promises';

import GithubRepositoryScraper from '../../../../../routes/scrapers/github-repository-scraper.mjs';

import getDownloadsPerPackage from '../../../../scraper_use_cases/add_downloads_to_table.mjs';

// Based on github repositories
export default async function makeProjectTable(toolTable, latestId) {
  console.log('Calculating companyTable');

  const allRecord = [];

  try {
    const allProjectName = toolTable.map(record => record.name);
    const projectNameToDownloads = await getDownloadsPerPackage(allProjectName);

    const allRepoURL = toolTable.map(record => {
          let AUTHOR_NAME = record.author_company;
          let PROJECT_NAME = record.name;
          if (/\s/.test(AUTHOR_NAME)) {
            AUTHOR_NAME = AUTHOR_NAME.replace(/\s/g, '');
          }
          if (/\s/.test(PROJECT_NAME)) {
            PROJECT_NAME = PROJECT_NAME.replace(/\s/g, '');;
          }
          return `https://github.com/${AUTHOR_NAME}/${PROJECT_NAME}`;
        });
    const scraperOfGithubRepos = new GithubRepositoryScraper(allRepoURL);
    const allAmountOfContributor = await scraperOfGithubRepos.run();

    for (let i = 0; i < toolTable.length; i++) {
      ++latestId;
      const PROJECT_NAME = toolTable[i].name;
      const record = {
        project_id: latestId,
        project_name: PROJECT_NAME,
        downloads: projectNameToDownloads[PROJECT_NAME] ?? null,
        contributors: allAmountOfContributor[i],
        searches: null,
      }
      allRecord.push(record);
    }
  } catch (error) {
    console.error('There was an error while calculating companyTable' + error);
  }
  
  return allRecord;
}
