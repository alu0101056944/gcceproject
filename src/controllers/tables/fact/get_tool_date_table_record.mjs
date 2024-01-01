/**
 * @author Marcos Barrios
 * @since 06_12_2023
 * @desc Make tool-date table.
 *
 * Because the i don't know how many dates are there in the database then manage
 *   the date persistent id on the file. Just make sure to assign a unique id anyways.
 *
 * This should be relative, run it once a day and get the version info
 * interest_level (google trends), calculate the change type since last time
 * by checking the previous history stored in the database.
 *
 * The change_type attribute represents whether a version change has happened
 * today and what kind of change. The alternative would be to check the already
 * stored in the database versions for the tool to compare versions, so instead
 * just go forward and rely on this getting executing daily.
 *
 */

import getInfo from '../../scraper_use_cases/get_repository_info.mjs';

export default async function getToolDateRecord(toolTable, idOfToday) {
  const allPartialURL =
      toolTable.map(tool => `${tool.author_company}/${tool.name}`);
  const allRepoInfo = await getInfo(allPartialURL);

  for (const record of toolTable) {
    const record = {
      version: allRepoInfo.version,
      
    }
    // level of interest (int)
    // change_type (string)
  }
}

(async () => {
  await makeToolDateTable();
})();
