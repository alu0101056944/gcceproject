/**
 * @author Marcos Barrios
 * @since 01_11_2023
 * @description Make project table.
 *
 */

'use strict';

import { readFile, writeFile } from 'fs/promises'

import makeToolsTableWithoutIdFromGithubExploreScrapper from './scrapper_usages/make_tools_from_github_explore.mjs';
import getDownloadsPerPackage from './scrapper_usages/add_downloads_to_table.mjs';

import { inspect } from 'util';
import GithubRepositoryScrapper from '../routes/github-repository-scrapper.mjs';
import GoogleTrendsScrapper from '../routes/google-trends-scrapper.mjs';

/**
 * @todo Logic for when project names are not github project names
 */
export default async function makeProjectTable() {
  const specializations = [
    'frontend',
    // 'backend',
    // 'embedded',
    // 'devops',
  ];
  const { tableObject } = await makeToolsTableWithoutIdFromGithubExploreScrapper(specializations);
  let projectId = 1;
  tableObject.forEach(
        record => {
          record.project_id = projectId++;
          delete record.specialization;
          delete record.type;
        }
      );

  const projectNames = tableObject.map(record => record.name);

  const downloadsPerPackage = await getDownloadsPerPackage(projectNames);
  tableObject.forEach((record, i) => {
        record.downloads = downloadsPerPackage[record.name]
      });

  const urlsOfRepositories = tableObject.map(record => {
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
  const scrapperOfGithubRepos = new GithubRepositoryScrapper(urlsOfRepositories);
  const allAmountOfContributors = await scrapperOfGithubRepos.run();
  tableObject.forEach((record, i) => {
        record.contributors = allAmountOfContributors[i];
      });

  const scrapperOfTrends = new GoogleTrendsScrapper(projectNames);
  const interestPerProject = await scrapperOfTrends.run();
  tableObject.forEach((record) => {
        record.searches = interestPerProject[record.name];
      });

  // I just kept author_company for the github repository access, it does not
  // belong to the table.
  tableObject.forEach(record => delete record.author_company);

  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);
  persistentIds.tool = tableObject.length;
  const TO_JSON = JSON.stringify(persistentIds, null, 2);
  await writeFile('./src/persistent_ids.json', TO_JSON);

  return tableObject;
}

// console.log(inspect(await makeProjectTable()));
