/**
 * @author Marcos Barrios
 * @since 06_01_2024
 * @description Meant to allow different sources of records for the same
 *    tables throuh the EndpointWriter class. This one handles the github source.
 */

'use strict';

import EndpointWriter from './endpoint_writer.mjs';

import { readFile } from 'fs/promises';

import makeMarketDateTable from './tables/source/linkedin/fact/make_market_date_table.mjs';
import makeMarketToolDateTable from './tables/source/linkedin/fact/make_market_tool_date_table.mjs';

async function getDependencyTreeForLinkedinRecords() {
  const allDependencyTree = [
    {
      tableName: 'marketDate',
      resolver: async () => {
        const FILE_CONTENT =
            await readFile('outputTables/todayDateTable.json', 'utf8');
        const todayDateTable = JSON.parse(FILE_CONTENT);
        const TODAY_ID = todayDateTable[0].date_id;

        const ID_OF_EUROPE = 1;
        const table = await makeMarketDateTable(ID_OF_EUROPE, TODAY_ID);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return table;
      },
      dependencies: [],
    },

    {
      tableName: 'marketToolDate',
      resolver: async () => {
        const FILE_CONTENT =
            await readFile('outputTables/todayDateTable.json', 'utf8');
        const todayDateTable = JSON.parse(FILE_CONTENT);
        const TODAY_ID = todayDateTable[0].date_id;

        const FILE_CONTENT2 =
            await readFile('outputTables/toolTable.json', 'utf8');
        const toolTable = JSON.parse(FILE_CONTENT2);

        const ID_OF_EUROPE = 1;
        const table = await makeMarketToolDateTable(ID_OF_EUROPE, toolTable,
            TODAY_ID);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return table;
      },
      dependencies: [],
    },
  ];

  return allDependencyTree;
}

// make sure this is executed after community table has been created.
export default async function endpointLinkedin() {
  const allDependencyTree = await getDependencyTreeForLinkedinRecords();
  const writer = new EndpointWriter(allDependencyTree)
  await writer.parse();
}
