/**
 * @author Marcos Barrios
 * @since 12_12_2023
 * @desc Clear output tables and then scrape and generate records for the
 *    tables.
 */

import endpointManual from "./src/controllers/endpoint-manual.mjs";
import endpointGithub from "./src/controllers/endpoint-github.mjs";
import endpointLinkedin from "./src/controllers/endpoint-linkedin.mjs";
import endpointAfterall from "./src/controllers/endpoint-afterall.mjs";
import makeTodayDateRecord from "./src/controllers/tables/dimension/make_today_date_record.mjs";

import { readFile, writeFile } from 'fs/promises';
import { copy, emptyDir } from 'fs-extra';

async function main() {
  let amounts;
  try {
    const AMOUNTS = await readFile('amount_of_runs.json', 'utf-8');
    amounts = AMOUNTS.length === 0 ? { amountOfRuns: 0 } : JSON.parse(AMOUNTS);
  } catch (error) {
    amounts = { amountOfRuns: 0 };
    console.log('Error while reading amount_of_runs.json file:');
    if (error.code === 'ENOENT') {
      console.log('Regenerating file');
      const TO_JSON = JSON.stringify(amounts, null, 2);
      await writeFile('amount_of_runs.json', TO_JSON);
    } else {
      console.error(error);
    }
  }

  try {
    await copy('outputTables/', `outputTablesOld/${amounts.amountOfRuns}`,
        { overwrite: true,  });
    console.log('Sucessfuly copied outputTables/ into outputTablesOld/[i]');
  } catch (error) {
    console.error('There was an error while moving outputTables/ into ' +
        'outputTablesOld/[i]:');
    console.error(error);
  }

  ++amounts.amountOfRuns;
  const TO_JSON = JSON.stringify(amounts, null, 2);
  await writeFile('./amount_of_runs.json', TO_JSON);

  try {
    await emptyDir('outputTables/');
    console.log('Sucessfuly cleared outputTables/');
  } catch (error) {
    console.error('There was an error while emptying outputTables');
    console.error(error);
  }

  console.log();
  console.log('Starting program:');
  console.log();

  const todayRecord = await makeTodayDateRecord();
  await writeFile('outputTables/todayDateTable.json',
      JSON.stringify([todayRecord], null, 2));

  // IMPORTANT: order matters here due to table dependencies
  await endpointManual();
  await endpointGithub();
  await endpointLinkedin();
  await endpointAfterall();
}

main();
