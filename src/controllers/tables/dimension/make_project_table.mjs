/**
 * @author Marcos Barrios
 * @since 01_11_2023
 * @description Make project table.
 *
 */

'use strict';

import makeToolsTableWithoutIdFromGithubExploreScraper from '../../scraper_use_cases/make_tools_from_github_explore.mjs';
import getDownloadsPerPackage from '../../scraper_use_cases/add_downloads_to_table.mjs';

import { inspect } from 'util';
import GithubRepositoryScraper from '../../../routes/scrapers/github-repository-scraper.mjs';
import GoogleTrendsScraper from '../../../routes/scrapers/google-trends-scraper.mjs';

// Update README.md when deciding what to do with all projects are github projects issue
export default async function makeProjectTable() {
  const specializations = [
    'frontend',
    // 'backend',
    // 'embedded',
    // 'devops',
  ];
  const { tableObject } = await makeToolsTableWithoutIdFromGithubExploreScraper(specializations);
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
  const scraperOfGithubRepos = new GithubRepositoryScraper(urlsOfRepositories);
  const allAmountOfContributors = await scraperOfGithubRepos.run();
  tableObject.forEach((record, i) => {
        record.contributors = allAmountOfContributors[i];
      });

  const scraperOfTrends = new GoogleTrendsScraper(projectNames);
  const interestPerProject = await scraperOfTrends.run();
  tableObject.forEach((record) => {
        record.searches = interestPerProject[record.name];
      });

  // I just kept author_company for the github repository access, it does not
  // belong to the table.
  tableObject.forEach(record => delete record.author_company);

  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);
  persistentIds.project += tableObject.length;
  const TO_JSON = JSON.stringify(persistentIds, null, 2);
  await writeFile('./src/persistent_ids.json', TO_JSON);

  return tableObject;
}

// console.log(inspect(await makeProjectTable()));
