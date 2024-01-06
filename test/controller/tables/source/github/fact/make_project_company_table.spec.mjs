'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import makeCompanyTable from '../../../../../../src/controllers/tables/source/github/dimension/make_company_table.mjs';
import makeProjectTable from '../../../../../../src/controllers/tables/source/github/dimension/make_project_table.mjs';
import makeProjectCompanyTable from '../../../../../../src/controllers/tables/source/github/fact/make_project_company_table.mjs';

test('Creation is correct', async () => {
  const doMake = async () => {
    const companyTable = await makeCompanyTable();
    const projectTable = await makeProjectTable();
    const projectCompanyTable =
        await makeProjectCompanyTable(companyTable, projectTable);
  }
  await expect(doMake).not.toThrow();
});
