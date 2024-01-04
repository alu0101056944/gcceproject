/**
 * @author Marcos Barrios
 * @since 04_01_2024
 * @description Make market-tool-date table.
 *
 */

'use strict';

/**
 * market_id
 * tool_id
 * date_id
 * amount_of_mentions
 */
export default async function makeMarketToolDateTable(marketTable, toolTable,
    idOfToday) {
  const allRecord = [];

  const objectWithCountProperty = await getAmountOfOffers(allSearchTerm);
  for (const marketRecord of marketTable) { // Update README.md when differentiating markets.
    // surf linkedin and check how many times the tool is mentioned.
  }

  return allRecord;
}
