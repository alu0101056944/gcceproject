'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import makeCommunityToolDateTable from '../../../../src/controllers/tables/fact/make_community_tool_date_table.mjs';

test('Able to make community-tool-date table', async () => {
  test.setTimeout(7200000)
  const communityTable = [
    {
      community_id: 1,
      name: 'github',
      type: 'Open Source Hosting',
    },
  ];
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
  const allRecord = await makeCommunityToolDateTable(communityTable, toolTable, 5);
  await expect(allRecord.length).toBe(2);
  for (const [index, record] of allRecord.entries()) {
    await expect(record.community_id).toBe(1);
    await expect(record.tool_id).toBe(index + 1);
    await expect(record.date_id).toBe(5);
    await expect(record.tool_id).toBe(index + 1);
    await expect(record.tool_score).not.toBeUndefined();
    await expect(record.rank).toBe(null);
  }
});
