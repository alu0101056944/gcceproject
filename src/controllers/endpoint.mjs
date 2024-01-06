/**
 * @author Marcos Barrios
 * @since 06_01_2024
 * @description Meant to allow different sources of records for the same
 *    tables throuh the EndpointWriter class.
 */

'use strict';

import makeCompanyTable from './tables/dimension/make_company_table.mjs';
import makeProjectTable from './tables/dimension/make_project_table.mjs';
import makeToolTable from './tables/dimension/make_tool_table.mjs';

async function writeRecordsFromGithub() {
  const allDependencyTree = [
    {
      tableName: 'project',
      resolver: async (toolTable, latestId) => {
        const table = await makeProjectTable(toolTable, latestId);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return table;
      },
      dependencies: [
        {
          tableName: 'tool',
          resolver: async (latestId) => {
            const table = await makeToolTable(latestId);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return table;
          },
          dependencies: [],
        },
      ],
    },
    // { *** Need to extend endpoint writer with a new type of node that reuses tables
    //   tableName: 'company',
    //   resolver: async (toolTable, latestId) => {
    //     const table = await makeCompanyTable(toolTable, latestId);
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    //     return table;
    //   },
    //   dependencies: [
    //     {
    //       tableName: 'tool',
    //       resolver: async (latestId) => {
    //         const table = await makeToolTable(latestId);
    //         await new Promise(resolve => setTimeout(resolve, 1000));
    //         return table;
    //       },
    //       dependencies: [],
    //     },
    //   ],
    // },
  ];

  await new Promise(resolve => setTimeout(resolve, 1000));

  let projectTable;
  try {
    console.log('Calculating projectTable');
    projectTable = await makeProjectTable(toolTable);
  } catch (error) {
    console.error('There was an error while calculating projectTable' + error);
    projectTable = [];
  }
  await writeFile('outputTables/projectTable.json',
        JSON.stringify(projectTable, null, 2));

}

export default async function endpoint() {

}
