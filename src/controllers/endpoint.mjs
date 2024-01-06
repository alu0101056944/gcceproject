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

async function getDependencyTreeForGithubRecords() {
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
    {
      tableName: 'company',
      resolver: async (toolTable, latestId) => {
        const table = await makeCompanyTable(toolTable, latestId);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return table;
      },
      dependencies: [ { useTable: 'tool' } ],
    },
  ];

  return allDependencyTree
}

export default async function endpoint() {

}
