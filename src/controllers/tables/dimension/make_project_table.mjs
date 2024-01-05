/**
 * @author Marcos Barrios
 * @since 01_11_2023
 * @description Make project table.
 *
 */

'use strict';

import getDownloadsPerPackage from '../../scraper_use_cases/add_downloads_to_table.mjs';

import GithubRepositoryScraper from '../../../routes/scrapers/github-repository-scraper.mjs';

// Update README.md when deciding what to do with the all projects are github
// projects issue
export default async function makeProjectTable(toolTable) {
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
  const allAmountOfContributors = await scraperOfGithubRepos.run();

  const allRecord = [];
  for (let i = 0; i < toolTable.length; i++) {
    const PROJECT_NAME = toolTable[i].name;
    const record = {
      project_id: i + 1,
      project_name: PROJECT_NAME,
      downloads: projectNameToDownloads[PROJECT_NAME],
      contributors: allAmountOfContributors[i],
      searches: null,
    }
    allRecord.push(record);
  }

  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);
  persistentIds.project += allRecord.length;
  const TO_JSON = JSON.stringify(persistentIds, null, 2);
  await writeFile('./src/persistent_ids.json', TO_JSON);

  return allRecord;
}
