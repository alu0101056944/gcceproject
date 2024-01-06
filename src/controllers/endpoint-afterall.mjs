/**
 * @author Marcos Barrios
 * @since 06_01_2024
 * @description Meant to allow different sources of records for the same
 *    tables throuh the EndpointWriter class. This one handles the manual source.
 */

'use strict';

import EndpointWriter from './endpoint_writer.mjs';

import makeCompanyDate from './tables/fact/make_company_date_table.mjs';
import makeEmployeeToolTable from './tables/fact/make_employee_tool_table.mjs';

async function getDependencyTreeAfterAll() {
  const allDependencyTree = [
    {
      tableName: 'companyDate',
      resolver: async () => {
        const FILE_CONTENT =
            await readFile('outputTables/dateRecordOfToday.json', 'utf8');
        const todayDateTable = JSON.parse(FILE_CONTENT);
        const TODAY_ID = todayDateTable[0].date_id;

        const FILE_CONTENT2 =
            await readFile('outputTables/companyTable.json', 'utf8');
        const companyTable = JSON.parse(FILE_CONTENT2);

        const table = await makeCompanyDate(companyTable, TODAY_ID);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return table;
      },
      dependencies: [],
    },
    
    {
      tableName: 'employeeTool',
      resolver: async () => {
        const FILE_CONTENT =
            await readFile('outputTables/toolTable.json', 'utf8');
        const toolTable = JSON.parse(FILE_CONTENT);

        const table = await makeEmployeeToolTable(toolTable.length);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return table;
      },
      dependencies: [],
    },
  ];

  return allDependencyTree;
}

export default async function endpointAfterall() {
  await makeTodayDateRecord(); // this updates today's date_id in persistent_ids.json

  const allDependencyTree = await getDependencyTreeAfterAll();
  const writer = new EndpointWriter(allDependencyTree)
  await writer.parse();
}
