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
      tableName: 'tool',
      resolver: makeToolTable,
      dependencies: [],
    },
  ];

  let companyTable;
  try {
    console.log('Calculating companyTable');
    companyTable = await makeCompanyTable(toolTable);
  } catch (error) {
    console.error('There was an error while calculating companyTable' + error);
    companyTable = [];
  }
  await writeFile('outputTables/companyTable.json',
        JSON.stringify(companyTable, null, 2));

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
