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

import { compare } from 'compare-versions';

function toChangeType(allVersion) {
  const checkSemantic = (version) => version.match(/(\d+?)\.(\d+?)\.(\d+?)/);
  const allSemantic = allVersion.filter(checkSemantic);
  if (allSemantic.length === 0) {
    return 'non-semantic';
  }

  // check if all versions are the same
  for (let i = 1; i < allSemantic.length; i++) {
    if (i >= allSemantic.length - 1) {
      return 'same';
    }
    if (!compare(allSemantic[0], allSemantic[i], '=')) {
      break;
    }
  }

  const allNumbers = [];
  for (const version of allSemantic) {
    let currentNumber = '';
    const numbers = [];
    for (let i = 0; i < version.length; i++) {
      if (version[i].match(/\d/)) {
        currentNumber += version[i];
      } else {
        numbers.push(parseInt(currentNumber));
        currentNumber = '';
      }
    }
    allNumbers.push(numbers);
  }

  let changeType = 'major';

  const allChangeType = ['major', 'minor', 'path'];
  for (let i = 0; i < 3; i++) { // [major|minor|patch]
    changeType = allChangeType[i];
    const relevantNumbers = allNumbers.map(numbers => numbers[i]);
    const thereIsChange = new Set(relevantNumbers).length > 1;
    if (thereIsChange) {
      break;
    }
  }

  return changeType;
}

export default async function getToolDateRecord(toolTable, idOfToday) {
  const allPartialURL =
      toolTable.map(tool => `${tool.author_company}/${tool.name}`);
  const allRepoInfo = await getInfo(allPartialURL);

  for (const record of toolTable) {
    const PARTIAL_URL = `${record.author_company}/${record.name}`;
    const scraper = new latestFiveVersionsScraper([PARTIAL_URL]);
    const latestVersions = (await scraper.run())[PARTIAL_URL];
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
