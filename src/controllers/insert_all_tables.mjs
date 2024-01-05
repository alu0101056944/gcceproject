/**
 * @author Marcos Barrios
 * @since 03_11_2023
 * @description Make and insert all tables into the postgresql database.
 */

import { writeFile } from 'fs/promises';

import makeEmployeeTable from './tables/dimension/make_employee_table.mjs';
import makeToolTable from './tables/dimension/make_tool_table.mjs';
import makeCommunityTable from './tables/dimension/make_community_table.mjs';
import makeCompanyTable from './tables/dimension/make_company_table.mjs';
import makeProjectTable from './tables/dimension/make_project_table.mjs';
import makeMarketTable from './tables/dimension/make_market_table.mjs';
import getNewDateRecord from './tables/dimension/get_date_table_record.mjs';

import makeCommunityToolDateTable from './tables/fact/get_tool_date_table_record.mjs';
import makeCommunityToolTable from './tables/fact/make_community_tool_table.mjs';
import makeCompanyDate from './tables/fact/make_company_date_table.mjs';
import makeEmployeeToolTable from './tables/fact/make_employee_tool_table.mjs';
import makeMarketDateTable from './tables/fact/make_market_date_table.mjs';
import makeMarketToolDateTable from './tables/fact/make_market_tool_date_table.mjs';
import makeProjectCompanyTable from './tables/fact/make_project_company_table.mjs';
import makeProjectToolTable from './tables/fact/make_project_tool_table.mjs';
import makeToolProjectCompanyTable from './tables/fact/make_tool_project_company_table.mjs';

export default async function insertAllTables() {
  const toolTable = await makeToolTable();
  await writeFile('outputTables/toolTable.json',
      JSON.stringify(toolTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  const companyTable = await makeCompanyTable(toolTable);
  await writeFile('outputTables/companyTable.json',
      JSON.stringify(companyTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  const employeeTable = await makeEmployeeTable();
  await writeFile('outputTables/employeeTable.json',
      JSON.stringify(employeeTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  const communityTable = await makeCommunityTable();
  await writeFile('outputTables/communityTable.json',
      JSON.stringify(communityTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  const projectTable = await makeProjectTable();
  await writeFile('outputTables/projectTable.json',
      JSON.stringify(projectTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  const marketTable = await makeMarketTable();
  await writeFile('outputTables/marketTable.json',
      JSON.stringify(marketTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  const dateRecordOfToday = await getNewDateRecord();
  await writeFile('outputTables/dateRecordOfToday.json',
      JSON.stringify(dateRecordOfToday, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  const communityToolDateTable =
      await makeCommunityToolDateTable(companyTable, dateRecordOfToday.date_id);
  await writeFile('outputTables/communityToolDateTable.json',
      JSON.stringify(communityToolDateTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  const communityToolTable =
      await makeCommunityToolTable(toolTable, communityTable);
  await writeFile('outputTables/communityToolTable.json',
      JSON.stringify(communityToolTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  const companyDateTable =
      await makeCompanyDate(companyTable, dateRecordOfToday.date_id);
  await writeFile('outputTables/companyDateTable.json',
      JSON.stringify(companyDateTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  const employeeToolTable = await makeEmployeeToolTable(toolTable.length);
  await writeFile('outputTables/employeeToolTable.json',
      JSON.stringify(employeeToolTable, null, 2));
  
  await new Promise(resolve => setTimeout(resolve, 1000));

  const marketDateTable =
      await makeMarketDateTable(marketTable, dateRecordOfToday.date_id);
  await writeFile('outputTables/marketDateTable.json',
      JSON.stringify(marketDateTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  const marketToolDateTable =
      await makeMarketToolDateTable(marketTable, toolTable,
          dateRecordOfToday.date_id);
  await writeFile('outputTables/marketToolDateTable.json',
      JSON.stringify(marketToolDateTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const projectCompanyTable =
      await makeProjectCompanyTable(companyTable, projectTable);
  await writeFile('outputTables/projectCompanyTable.json',
      JSON.stringify(projectCompanyTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  const projectToolTable = await makeProjectToolTable(toolTable);
  await writeFile('outputTables/projectToolTable.json',
      JSON.stringify(projectToolTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const toolProjectCompanyTable =
      await makeToolProjectCompanyTable(toolTable, projectTable, companyTable);
  await writeFile('outputTables/toolProjectCompanyTable.json',
      JSON.stringify(toolProjectCompanyTable, null, 2));
}

insertAllTables();
