'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import makeProjectCompanyTable from '../../../../../../src/controllers/tables/source/github/fact/make_project_company_table.mjs';

test('Creation is correct', async () => {
  const doMake = async () => {
    const companyTable = [
      {
        "company_id": 2,
        "name": "facebook",
        "employee_amount": null,
        "type": null,
        "amount_of_searches": null
      },
      {
        "company_id": 3,
        "name": "vuejs",
        "employee_amount": null,
        "type": null,
        "amount_of_searches": null
      },
    ];
    const projectTable = [
      {
        "project_id": 9,
        "project_name": "react",
        "downloads": 12071803,
        "contributors": 1645,
        "searches": null
      },
      {
        "project_id": 10,
        "project_name": "vue",
        "downloads": 2312117,
        "contributors": 365,
        "searches": null
      },
    ];
    const projectCompanyTable =
        await makeProjectCompanyTable(companyTable, projectTable);
  }
});
