
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
 * @param {object} toolTable ready for database insertion
 * @param {object} projectTable ready for database insertion
 */
export default async function makeTable(toolTable, projectTable) {
  // WIP modifying github dependencies scrapper to not be output all dependencies
  // in a raw array, but rather have an object where each object has the
  // it's dependencies.
  
  // const table = [];

  // const scrapperOfDependencies = new GithubDependenciesScrapper(toolTable);

  // return table;
}
  
// makeTable().then((data) => console.log(inspect(data)));
