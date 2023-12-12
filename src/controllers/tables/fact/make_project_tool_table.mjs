/**
 * @author Marcos Barrios
 * @since 03_11_2023
 * @description Make project_tool table.
 *
 */

'use strict';

import GithubDependenciesScraper from "../../../routes/scrapers/github-dependencies-scraper.mjs";

/**
 * @param {array} toolTable ready for database insertion
//  * @param {array} projectTable ready for database insertion
 */
export default async function makeProjectToolTable(toolTable/*, projectTable*/) {
  const table = [];

  // For now I just check if the dependency is in the tool table.
  // if it's not then nothing.

  const scraperOfDependencies = new GithubDependenciesScraper(toolTable);
  scraperOfDependencies.setOutputLength(20);
  scraperOfDependencies.setMaxAmountOfPageSurfs(20);
  const dependenciesPerTool = await scraperOfDependencies.run();

  for (const toolInfo of toolTable) {
    for (const dependency of dependenciesPerTool[toolInfo.name]) {

      // Check if dependency is a stored tool
      for (const toolInfo2 of toolTable) {
        if (toolInfo.name === dependency) {
          table.push({
            project_id: toolInfo.tool_id, // just for now because all projects are tools too for now
            tool_id: toolInfo2.tool_id,
          });
        }
      }
    }
  }

  return table;
}
  
// makeProjectToolTable().then((data) => console.log(inspect(data)));
