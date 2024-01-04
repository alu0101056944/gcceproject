/**
 * @author Marcos Barrios
 * @since 04_01_2024
 * @description Make market-date table.
 *
 */

'use strict';

import getAmountOfOffers from "../../scraper_use_cases/get_market_offers.mjs";

export default async function makeMarketDateTable(marketTable, idOfToday) {
  const allRecord = [];

  const allSearchTerm = [
    'Software engineer',
  ];

  const objectWithCountProperty = await getAmountOfOffers(allSearchTerm);
  for (const marketRecord of marketTable) { // Update README.MD on change
    const record = {
      market_id: marketRecord.market_id,
      date_id: idOfToday,
      total_amount_of_offers: objectWithCountProperty.count,
    }
    allRecord.push(record);
  }

  return allRecord;
}
