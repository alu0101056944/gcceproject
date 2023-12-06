import makeCompanyTable from "../../src/controllers/tables/dimension/make_company_table.mjs";
import makeProjectTable from "../../src/controllers/tables/dimension/make_project_table.mjs";
import makeProjectCompanyTable from "../../src/controllers/tables/fact/make_project_company_table.mjs";

describe('Test project company table creation', () => {
  test('Creation is correct', async () => {
    const doMake = async () => {
      const companyTable = await makeCompanyTable();
      const projectTable = await makeProjectTable();
      const projectCompanyTable =
          await makeProjectCompanyTable(companyTable, projectTable);
    }
    expect(doMake).not.toThrow();
  })
});
