/**
 * @author Marcos Barrios
 * @since 03_11_2023
 * @description Make project_tool table.
 *
 */

'use strict';

import GithubDependenciesScraper from "../../../../../routes/scrapers/github-dependencies-scraper.mjs";

export default async function makeProjectToolTable(toolTable, projectTable) {
  console.log('Calculating projectToolTable');

  const allRecord = [];

  try {
    const scraperOfDependencies = new GithubDependenciesScraper(toolTable);
    scraperOfDependencies.setOutputLength(20);
    scraperOfDependencies.setMaxAmountOfPageSurfs(4);
    const toolNameToDependencyNameSet = await scraperOfDependencies.run();

    for (const toolRecord of toolTable) {
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
