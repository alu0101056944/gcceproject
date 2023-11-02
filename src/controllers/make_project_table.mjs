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

  const packageNames = recordsGithub.map(record => record.name);
  const downloadsPerPackage = getDownloadsPerPackage(packageNames);
  recordsGithub.forEach((record, i) => record.downloads = downloadsPerPackage[i]);

  const urlsOfRepositories = recordsGithub.map(record => {
        let companyName = record.companyName;
        let projectName = record.name;
        if (/\s/g.test(record.author_company)) {
          companyName = companyName.replace(/\s/g, '');
        }
        if (/\s/g.test(record.name)) {
          projectName = projectName.replace(/\s/g, '');;
        }
        return `https://github.com/${record.author_company}/${record.name}`;
      });
  const githubProfileScrapper = new GithubRepositoryScrapper(urlsOfRepositories);
  const allAmountOfContributors = await githubProfileScrapper.run();
  recordsGithub.forEach((record, i) => {
        return record.contributors = allAmountOfContributors[i];
      });

  

  recordsGithub.forEach(record => delete record.author_company);

  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);
  persistentIds.tool = recordsGithub.length;
  const TO_JSON = JSON.stringify(persistentIds, null, 2);
  await writeFile('./src/persistent_ids.json', TO_JSON);

  return recordsGithub;
}

// makeTable().then((data) => console.log(inspect(data)));
