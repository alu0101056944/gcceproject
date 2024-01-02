'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import makeCommunityToolTable from '../../../../src/controllers/tables/fact/make_community_tool_table.mjs';

test('Able to make community-tool table', async () => {
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
  const communityTable = [
    {
      community_id: 1,
      name: 'github',
      type: 'Open Source Hosting',
    },
  ];
  const allRecord = await makeCommunityToolTable(toolTable, communityTable);
  await expect(allRecord.length).not.toBe(0);
  for (const [index, record] of allRecord.entries()) {
    await expect(record.tool_id).toBe(index + 1);
    await expect(record.community_id).toBe(1);
    await expect(record.amount_of_bugs_reported).not.toBeUndefined();
    await expect(record.amount_of_bugs_solved).not.toBeUndefined();
    await expect(record.amount_of_changes_commited).not.toBeUndefined();
    await expect(record.amount_of_discussions).not.toBeUndefined();
  }
});
