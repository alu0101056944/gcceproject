/**
 * @author Marcos Barrios
 * @since 04_01_2024
 * @description Make market-tool-date table.
 *
 */

'use strict';

import LinkedinMentionsScraper from "../../../../../routes/scrapers/linkedin-mentions-scraper.mjs";

export default async function makeMarketToolDateTable(marketTable, toolTable,
    idOfToday) {
  const allRecord = [];

  const allToolName = toolTable.map(record => record.name);
  const scraper = new LinkedinMentionsScraper(allToolName);
  const toolNameToMentionAmount = await scraper.run();

  const MARKET_ID = 1; // Update README.md when differentiating markets.
  for (const toolRecord of toolTable) {
    const record = {
      market_id: MARKET_ID,
      tool_id: toolRecord.tool_id,
      date_id: idOfToday,
      amount_of_mentions: toolNameToMentionAmount[toolRecord.name],
    }
    allRecord.push(record);
  }

  return allRecord;
}
