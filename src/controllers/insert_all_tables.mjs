

// import pgPromise from 'pg-promise';
const pgp = pgPromise();
// const db = pgp({
//   connectionString: 'postgres://postgres:454565@localhost:5432/raw_database',
//   max: 20
// });

import makeEmployeeTable from './tables/dimension/make_employee_table.mjs';
import makeToolTable from './tables/dimension/make_tool_table.mjs';
import makeCommunityTable from './tables/dimension/make_community_table.mjs';
import makeCompanyTable from './tables/dimension/make_company_table.mjs';
import makeProjectTable from './tables/dimension/make_project_table.mjs';
import makeMarketTable from './tables/dimension/make_market_table.mjs';
import makeProjectCompany from './tables/fact/make_project_company_table.mjs';
import getNewDateRecord from './tables/dimension/add_date_entry_to_date_table.mjs';

import { inspect } from 'util';

// export default async function insertAllTables() {
//   const toolTable = await makeToolTable();
//   const insertToolTable =
//       pgp.helpers.insert(toolTable,
//         ['tool_id', 'name', 'author_company', 'type', 'specialization'], 'tool');
//   console.log(inspect(toolTable));
// }

export default async function insertAllTables() {
  // await db.none('DELETE FROM $1:raw', ['company']);
  const employeeTable = await makeEmployeeTable();
  // const insertEmployeeTable =
  //     pgp.helpers.insert(
  //         employeeTable,
  //         [
  //           'employee_id',
  //           'name',
  //           'title',
  //           'department'
  //         ],
  //         'employee'
  //       );

  const toolTable = await makeToolTable();
  // const insertToolTable =
  //     pgp.helpers.insert(
  //         toolTable,
  //         [
  //           'tool_id',
  //           'name',
  //           'author_company',
  //           'type',
  //           'specialization'
  //         ],
  //         'tool'
  //       );

  const communityTable = await makeCommunityTable();
  // const insertCommunityTable =
  //     pgp.helpers.insert(
  //         communityTable,
  //         [
  //           'community_id',
  //           'name',
  //           'type'
  //         ],
  //         'community'
  //       );

  const companyTable = await makeCompanyTable();
  // console.log(inspect(companyTable));
  // const insertCompanyTable =
  //     pgp.helpers.insert(
  //         companyTable,
  //         [
  //           'company_id',
  //           'name',
  //           'employee_amount',
  //           'amount_of_searches',
  //           'type'
  //         ],
  //         'company'
  //       );

  const projectTable = await makeProjectTable();
  // const insertProjectTable =
  //     pgp.helpers.insert(
  //         projectTable,
  //         [
  //           'project_id',
  //           'project_name',
  //           'downloads',
  //           'contributors',
  //           'searches'
  //         ],
  //         'project'
  //       );

  // generate new date entry per day
  // const lastDateFromTable = new Date(); // @todo assign actual value
  // if (new Date().getDay() < lastDayDate.getDay()) {
  //   const newDateRecord = getNewDateRecord();
  //   const insertNewDate =
  //       pgp.helpers.insert(['date_id', 'date'], 'date');
  //   await ddb.none(insertNewDate);
  // }

  const projectCompanyTable =
      await makeProjectCompany(companyTable, projectTable);
  // const insertProjectCompanyTable =
  //     pgp.helpers.insert(
  //         projectTable,
  //         [
  //           'project_id',
  //           'company_id',
  //           'budget',
  //           'amount_of_employees_assigned'
  //         ],
  //         'project_company'
  //       );

  // const marketTable = await makeMarketTable();
  // const insertMarketTable =
  //     pgp.helpers.insert(marketTable, ['market_id'], 'market');

  // try {
  //   // await db.none(insertEmployeeTable);
  //   // await db.none(insertToolTable);
  //   // await db.none(insertCommunityTable);
  //   await db.none(insertCompanyTable);
  //   // await db.none(insertProjectTable);
  //   // await db.none(insertMarketTable);
  // } catch (error) {
  //   console.error('Error when inserting a table: ' + error);
  // }
}

(async () => {
      await insertAllTables();
    })();