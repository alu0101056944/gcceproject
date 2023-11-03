
/**
 * @author Marcos Barrios
 * @since 03_11_2023
 * @description Make project_tool table.
 *
 */

'use strict';

import GithubDependenciesScrapper from "../routes/github-dependencies-scrapper.mjs";

// import { inspect } from 'util';

/**
 * @param {array} toolTable ready for database insertion
//  * @param {array} projectTable ready for database insertion
 */
export default async function makeTable(toolTable/*, projectTable*/) {
  const table = [];

  // @todo Diferentiate tool from project

  // For now I just check if the dependency is in the tool table.
  // if it's not then nothing.

  const scrapperOfDependencies = new GithubDependenciesScrapper(toolTable);
  scrapperOfDependencies.setOutputLength(20);
  scrapperOfDependencies.setMaxAmountOfPageSurfs(20);
  const dependenciesPerTool = await scrapperOfDependencies.run();

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
  
// makeTable().then((data) => console.log(inspect(data)));
