/**
 * @author Marcos Barrios
 * @since 06_01_2024
 * @description Meant to allow different sources of records for the same
 *    tables throuh the EndpointWriter class. This one handles the manual source.
 */

'use strict';

import EndpointWriter from './endpoint_writer.mjs';

import makeCommunityTable from './tables/dimension/make_community_table.mjs';
import makeEmployeeTable from './tables/dimension/make_employee_table.mjs';

async function getDependencyTreeFromManual() {
  const allDependencyTree = [
    {
      tableName: 'community',
      resolver: async () => {
        const table = await makeCommunityTable();
        await new Promise(resolve => setTimeout(resolve, 1000));
        return table;
      },
      dependencies: [],
    },
    

  ];

  return allDependencyTree;
}

export default async function endpointManual() {
  const allDependencyTree = await getDependencyTreeFromManual();
  const writer = new EndpointWriter(allDependencyTree)
  await writer.parse();
}
