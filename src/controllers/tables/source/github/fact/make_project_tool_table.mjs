/**
 * @author Marcos Barrios
 * @since 03_11_2023
 * @description Make project_tool table.
 *
 */

'use strict';

import GithubDependenciesScraper from "../../../../../routes/scrapers/github-dependencies-scraper.mjs";

/**
 * @param {array} toolTable ready for database insertion
//  * @param {array} projectTable ready for database insertion
 */
export default async function makeProjectToolTable(toolTable/*, projectTable*/) {
  console.log('Calculating projectToolTable');

  const allRecord = [];

  try {
    // For now I just check if the dependency is in the tool table.
    // if it's not then nothing.

    const scraperOfDependencies = new GithubDependenciesScraper(toolTable);
    scraperOfDependencies.setOutputLength(20);
    scraperOfDependencies.setMaxAmountOfPageSurfs(4);
    const toolNameToDependencyNameSet = await scraperOfDependencies.run();

    for (const toolRecord of toolTable) {
      for (const [index, dependency] of toolNameToDependencyNameSet[toolRecord.name].entries()) {
  
        // Check if dependency is a stored tool
        for (const toolRecord of toolTable) {
          if (toolInfo.name === dependency) {
            allRecord.push({
              project_id: toolInfo.tool_id, // just for now because all projects are tools temporarily
              tool_id: toolRecord.tool_id,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('There was an error while calculating ' + 
        'projectToolTable' + error);
  }

  return allRecord;
}
