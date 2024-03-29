/**
 * @author Marcos Barrios
 * @since 06_12_2023
 * @desc Make tool-date table.
 *
 * Because the I don't know how many dates are there in the database then manage
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

import getAllLatestVersionChanges from '../../../../scraper_use_cases/get_latest_five_version_changes.js';

import { compare } from 'compare-versions';

function toChangeType(allVersion) {
  if (allVersion.length === 0) {
    return null;
  }

  const semanticRegExp = /(\d+?)\.(\d+?)\.(\d+?)/;
  const allSemantic =
      allVersion
      .filter(version => version.match(semanticRegExp))
      .map(version => {
        const regExpResult = version.match(semanticRegExp);
        return `${regExpResult[1]}.${regExpResult[2]}.${regExpResult[3]}`;
      });
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
    const numbers = [];
    const numberRegExp = /\d+/g;
    let execResult;
    while (execResult = numberRegExp.exec(version)) {
      numbers.push(execResult[0]);
    }
    allNumbers.push(numbers);
  }

  let changeType = 'major';

  const allChangeType = ['major', 'minor', 'patch'];
  for (let i = 0; i < 3; i++) { // [major|minor|patch]
    changeType = allChangeType[i];
    const relevantNumbers = allNumbers.map(numbers => numbers[i]);
    const thereIsChange = new Set(relevantNumbers).size > 1;
    if (thereIsChange) {
      break;
    }
  }

  return changeType;
}

export default async function makeToolDateTable(toolTable, idOfToday) {
  console.log('Calculating toolDateTable');

  const allRecord = [];

  try {
    const allPartialURL =
        toolTable.map(tool => `${tool.author_company}/${tool.name}`);

    for (const record of toolTable) {
      const PARTIAL_GITHUB_URL = `${record.author_company}/${record.name}`;

      const partialURLToAllVersion =
          await getAllLatestVersionChanges([PARTIAL_GITHUB_URL]);
      const allLatestVersion = partialURLToAllVersion[PARTIAL_GITHUB_URL];

      allRecord.push({
        tool_id: record.tool_id,
        date_id: idOfToday,
        version: allLatestVersion?.[0] ?? null,
        interest_levels: null,
        change_type: toChangeType(allLatestVersion) ?? null,
      });
    }
  } catch (error) {
    console.error('There was an error while calculating toolDateTable' + error);
  }
  
  return allRecord;
}
