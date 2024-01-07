/**
 * @author Marcos Barrios
 * @since 03_11_2023
 * @description Make project_tool table.
 *
 */

'use strict';

import 'dotenv/config'; // to load into process.env the keys at .env

async function fetchDependencies(authorCompany, repoName) {
  const repoNameToDependenciesSet = {};

  const URL =
        `https://api.github.com/repos/${authorCompany}/${repoName}/dependency-graph/sbom`;
  const response = await fetch(URL, {
    headers: {
      'User-Agent': 'Our script',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json',
    }
  });

  const body = await response.json();
  const AS_STRING = JSON.stringify(body);

  const DEPENDENCY_NAME_REG_EXP = /"name":"([^",]+?:)?([^",]+?)"/g;
  let regExpResult;
  while (regExpResult = DEPENDENCY_NAME_REG_EXP.exec(AS_STRING)) {
    repoNameToDependenciesSet[repoName] ??= new Set();
    repoNameToDependenciesSet[repoName].add(regExpResult[2]);
  }

  return repoNameToDependenciesSet;
}

export default async function makeProjectToolTable(toolTable, projectTable) {
  console.log('Calculating projectToolTable');

  const allRecord = [];

  try {
    for (const toolRecord of toolTable) {
      const toolNameToDependencyNameSet =
          await fetchDependencies(toolRecord.author_company, toolRecord.name);
      const dependencySet = toolNameToDependencyNameSet[toolRecord.name];
      for (const projectRecord of projectTable) {
        if (dependencySet.has(projectRecord.name)) {
          allRecord.push({
            project_id: projectRecord.project_id,
            tool_id: toolRecord.tool_id,
          });
        }
      }
    }
  } catch (error) {
    console.error('There was an error while calculating projectToolTable' +
        error);
  }

  return allRecord;
}
