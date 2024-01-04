'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import getAllToolSentiment from '../../../src/controllers/scraper_use_cases/get_tool_sentiment.mjs';

test('Can get the tool sentiment', async () => {
  const toolTable = [
    {
      "name": "react",
      "author_company": "facebook",
      "specialization": "frontend",
      "type": "ui",
      "tool_id": 1
    },
  ];
  const TOTAL_TOOL_SENTIMENT = (await getAllToolSentiment(toolTable))[0];
  await expect(TOTAL_TOOL_SENTIMENT).not.toBeUndefined();
});
