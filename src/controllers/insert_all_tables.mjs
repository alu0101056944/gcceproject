/**
 * @author Marcos Barrios
 * @since 03_11_2023
 * @description Make and insert all tables into the postgresql database.
 */

import { writeFile } from 'fs/promises';

import makeEmployeeTable from './tables/dimension/make_employee_table.mjs';
import makeToolTable from './tables/dimension/github/make_tool_table.mjs';
import makeCommunityTable from './tables/dimension/make_community_table.mjs';
import makeCompanyTable from './tables/dimension/github/make_company_table.mjs';
import makeProjectTable from './tables/dimension/github/make_project_table.mjs';
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
import getToolDateRecord from './tables/fact/get_tool_date_table_record.mjs';

export default async function insertAllTables() {
  let employeeTable;
  try {
    console.log('Calculating employeeTable');
    employeeTable = await makeEmployeeTable();
  } catch (error) {
    console.error('There was an error while calculating employeeTable' + error);
    employeeTable = [];
  }
  await writeFile('outputTables/employeeTable.json',
        JSON.stringify(employeeTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  let communityTable;
  try {
    console.log('Calculating communityTable');
    communityTable = await makeCommunityTable();
  } catch (error) {
    console.error('There was an error while calculating communityTable' + error);
    communityTable = [];
  }
  await writeFile('outputTables/communityTable.json',
        JSON.stringify(communityTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  await new Promise(resolve => setTimeout(resolve, 1000));

  let marketTable;
  try {
    console.log('Calculating marketTable');
    marketTable = await makeMarketTable();
  } catch (error) {
    console.error('There was an error while calculating marketTable' + error);
    marketTable = [];
  }
  await writeFile('outputTables/marketTable.json',
        JSON.stringify(marketTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  let dateRecordOfToday;
  try {
    console.log("Writing today's date record");
    dateRecordOfToday = await getNewDateRecord();
  } catch (error) {
    console.error('There was an error while calculating today\'s record' + error);
    dateRecordOfToday = [];
  }
  await writeFile('outputTables/dateRecordOfToday.json',
        JSON.stringify(dateRecordOfToday, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  let communityToolDateTable;
  try {
    console.log('Calculating communityToolDateTable');
    communityToolDateTable =
        await makeCommunityToolDateTable(toolTable, dateRecordOfToday.date_id);
  } catch (error) {
    communityToolDateTable = [];
    console.error('There was an error while calculating communityToolDateTable' + error);
  }
  await writeFile('outputTables/communityToolDateTable.json',
    JSON.stringify(communityToolDateTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  let communityToolTable;
  try {
    console.log('Calculating communityToolTable');
    communityToolTable =
        await makeCommunityToolTable(toolTable, communityTable);
  } catch (error) {
    communityToolTable = [];
    console.error('There was an error while calculating communityToolTable' + error);
  }
  await writeFile('outputTables/communityToolTable.json',
      JSON.stringify(communityToolTable, null, 2));


  await new Promise(resolve => setTimeout(resolve, 1000));

  let companyDateTable;
  try {
    console.log('Calculating companyDateTable');
    companyDateTable =
        await makeCompanyDate(companyTable, dateRecordOfToday.date_id);
  } catch (error) {
    companyDateTable = [];
    console.error('There was an error while calculating companyDateTable' + error);
  }
  await writeFile('outputTables/companyDateTable.json',
    JSON.stringify(companyDateTable, null, 2));


  await new Promise(resolve => setTimeout(resolve, 1000));

  let employeeToolTable;
  try {
    console.log('Calculating employeeToolTable');
    employeeToolTable = await makeEmployeeToolTable(toolTable.length);
  } catch (error) {
    console.error('There was an error while calculating employeeToolTable' + error);
    employeeToolTable = [];
  }
  await writeFile('outputTables/employeeToolTable.json',
        JSON.stringify(employeeToolTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  let marketDateTable;
  try {
    console.log('Calculating marketDateTable');
    marketDateTable =
        await makeMarketDateTable(marketTable, dateRecordOfToday.date_id);
  } catch (error) {
    marketDateTable = [];
    console.error('There was an error while calculating marketDateTable' + error);
  }
  await writeFile('outputTables/marketDateTable.json',
    JSON.stringify(marketDateTable, null, 2));


  await new Promise(resolve => setTimeout(resolve, 1000));

  let marketToolDateTable;
  try {
    console.log('Calculating marketToolDateTable');
    marketToolDateTable =
        await makeMarketToolDateTable(marketTable, toolTable,
          dateRecordOfToday.date_id);
  } catch (error) {
    marketToolDateTable = [];
    console.error('There was an error while writing marketToolDateTable' + error);
  }
  await writeFile('outputTables/marketToolDateTable.json',
      JSON.stringify(marketToolDateTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  let projectCompanyTable;
  try {
    console.log('Calculating projectCompanyTable');
    projectCompanyTable =
        await makeProjectCompanyTable(companyTable, projectTable);
  } catch (error) {
    projectCompanyTable = [];
    console.error('There was an error while calculating projectCompanyTable' + error);
  }
  await writeFile('outputTables/projectCompanyTable.json',
    JSON.stringify(projectCompanyTable, null, 2));


  await new Promise(resolve => setTimeout(resolve, 1000));

  let projectToolTable;
  try {
    console.log('Calculating projectToolTable');
    projectToolTable = await makeProjectToolTable(toolTable);
  } catch (error) {
    console.error('There was an error while calculating projectToolTable' + error);
    projectToolTable = [];
  }
  await writeFile('outputTables/projectToolTable.json',
        JSON.stringify(projectToolTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  let toolProjectCompanyTable;
  try {
    console.log('Calculating toolProjectCompanyTable');
    toolProjectCompanyTable =
      await makeToolProjectCompanyTable(toolTable, projectTable, companyTable);
  } catch (error) {
    toolProjectCompanyTable = [];
    console.error('There was an error while calculating toolProjectCompanyTable' + error);
  }
  await writeFile('outputTables/toolProjectCompanyTable.json',
    JSON.stringify(toolProjectCompanyTable, null, 2));

  await new Promise(resolve => setTimeout(resolve, 1000));

  let toolDateTable;
  try {
    console.log('Calculating toolDateTable');
    toolDateTable =
        await getToolDateRecord(toolTable, dateRecordOfToday.date_id);
  } catch (error) {
    toolDateTable = [];
    console.error('There was an error while calculating toolDateTable' + error);
  }
  await writeFile('outputTables/toolDateTable.json',
      JSON.stringify(toolDateTable, null, 2));
}

insertAllTables();
