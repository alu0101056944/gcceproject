'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import makeToolProjectCompanyTable from '../../../../src/controllers/tables/fact/make_tool_project_company_table.mjs';

test('Able to make tool-project-company table', async () => {
  const toolTable = [
    {
      "name": "react",
      "author_company": "facebook",
      "specialization": "frontend",
      "type": "ui",
      "tool_id": 1
    },
    {
      "name": "vue",
      "author_company": "vuejs",
      "specialization": "frontend",
      "type": "framework",
      "tool_id": 2
    },
  ];
  const projectTable = [
    {
      project_id: 1,
      project_name: 'react',
      downloads: 233238,
      contributors: 122,
      searches: 82,
    },
    {
      project_id: 2,
      project_name: 'vue',
      downloads: 129323,
      contributors: 83,
      searches: 79,
    },
  ];
  const companyTable = [
    {
      company_id: 1,
      name: 'facebook',
      employee_amount: 78,
      amount_of_searches: 99,
      type: 'foo',
    },
    {
      company_id: 2,
      name: 'vuejs',
      employee_amount: 12,
      amount_of_searches: 44,
      type: 'bar',
    }
  ];

  const allRecord = await makeToolProjectCompanyTable(toolTable, projectTable,
      companyTable);
  await expect(allRecord.length).not.toBe(0);
  for (const [index, record] of allRecord.entries()) {
    await expect(record.tool_id).toBe(index + 1);
    await expect(record.project_id).toBe(index + 1);
    await expect(record.company_id).toBe(index + 1);
  }
});
