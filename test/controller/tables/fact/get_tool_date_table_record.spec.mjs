'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import getToolDateRecord from "../../../../src/controllers/tables/fact/get_tool_date_table_record.mjs";

test('Results are valid', async () => {
  const toolTable = [
    {
      "name": "crawlee",
      "author_company": "apify",
      "specialization": "frontend",
      "type": "ui",
      "tool_id": 2
    },
  ]
  const allDateRecord = await getToolDateRecord(toolTable, 1);
  await expect(allDateRecord[0].tool_id).toEqual(2);
  await expect(allDateRecord[0].date_id).toEqual(1);
  await expect(allDateRecord[0].version).not.toBeUndefined();
  await expect(
    [
      'major',
      'minor',
      'patch',
      'non-semntic',
      'same'
    ]
    .includes(allDateRecord[0].change_type)).toBe(true);
});
