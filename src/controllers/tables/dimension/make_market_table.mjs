/**
 * @author Marcos Barrios
 * @since 03_11_2023
 * @description Make market table.
 *
 */

'use strict';

export default async function makeMarketTable() {
  const allRecord = [];

  const allMarket = [
    'europe',
    'united states',
    'asia',
  ];

  allRecord.push({
    market_id: 1,
  });
  allRecord.push({
    market_id: 2,
  });
  allRecord.push({
    market_id: 3,
  });

  return allRecord;
}
