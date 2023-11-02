/**
 * @author Marcos Barrios
 * @since 01_11_2023
 * @description Make project table.
 *
 */

'use strict';

import { readFile, writeFile } from 'fs/promises'

import makeToolsFromGithubExplore from './scrapper_usages/add_tool_entries_to_table.mjs';
import getDownloadsPerPackage from './scrapper_usages/add_downloads_to_table.mjs';

import { inspect } from 'util';
import GithubRepositoryScrapper from '../routes/github-repository-scrapper.mjs';
import GoogleTrendsScrapper from '../routes/google-trends-scrapper.mjs';

/**
 * @todo Logic for when project names are not github project names
 */
export default async function makeTable() {
  const specializations = [
    'frontend',
    // 'backend',
    // 'embedded',
    // 'devops',
  ];
  const recordsGithub = await makeToolsFromGithubExplore(specializations);
  let projectId = 1;
  recordsGithub.forEach(
        record => {
          record.project_id = projectId++;
          delete record.specialization;
          delete record.type;
        }
      );

  const projectNames = recordsGithub.map(record => record.name);

  const downloadsPerPackage = await getDownloadsPerPackage(projectNames);
  recordsGithub.forEach((record, i) => record.downloads = downloadsPerPackage[i]);

  const urlsOfRepositories = recordsGithub.map(record => {
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
  recordsGithub.forEach((record, i) => {
        record.contributors = allAmountOfContributors[i];
      });

  const scrapperOfTrends = new GoogleTrendsScrapper(projectNames);
  const interestPerProject = await scrapperOfTrends.run();
  recordsGithub.forEach((record, i) => record.searches = interestPerProject[i]);

  // I just kept author_company for the github repository access, it does not
  // belong to the table.
  recordsGithub.forEach(record => delete record.author_company);

  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);
  persistentIds.tool = recordsGithub.length;
  const TO_JSON = JSON.stringify(persistentIds, null, 2);
  await writeFile('./src/persistent_ids.json', TO_JSON);

  return recordsGithub;
}

console.log(inspect(await makeTable()));
