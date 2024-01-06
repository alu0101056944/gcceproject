/**
 * @author Marcos Barrios
 * @since 04_01_2024
 * @description Make market-date table.
 *
 */

'use strict';

import getAmountOfOffers from "../../../../scraper_use_cases/get_market_offers.mjs";

export default async function makeMarketDateTable(idOfEurope, idOfToday) {
  console.log('Calculating marketDateTable');

  const allRecord = [];

  try {
    const allSearchTerm = [
      'Software engineer',
    ];
  
    const objectWithCountProperty = await getAmountOfOffers(allSearchTerm);
    const record = {
      market_id: idOfEurope,
      date_id: idOfToday,
      total_amount_of_offers: objectWithCountProperty.count,
    }
    allRecord.push(record);
  } catch (error) {
    console.error('There was an error while calculating marketDateTable' + error);
  }

  return allRecord;
}
