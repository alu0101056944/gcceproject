'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import makeProjectToolTable from '../../../../../../src/controllers/tables/source/github/fact/make_project_tool_table.mjs';

test('Able to make project-tool table', async () => {
  const toolTable = [
    {
      "tool_id": 9,
      "name": "react",
      "author_company": "facebook",
      "specialization": "frontend",
      "type": "ui"
    },
    {
      "tool_id": 10,
      "name": "vue",
      "author_company": "vuejs",
      "specialization": "frontend",
      "type": "framework"
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
  const table = await makeProjectToolTable(toolTable, projectTable);
  expect(table.length).not.toBe(0);
});

