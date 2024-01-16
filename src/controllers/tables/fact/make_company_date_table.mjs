/**
 * @author Marcos Barrios
 * @since 04_01_2024
 * @description Make company-date table.
 *
 */

'use strict';

import getStocks from "../../scraper_use_cases/get_company_benefits.mjs";

export default async function makeCompanyDate(companyTable) {
  const allRecord = [];

  const companyNameToDelta = await getStocks(companyTable.map(record => record.name));

  for (const companyRecord of companyTable) {
    const record = {
      company_id: companyRecord.company_id,
      benefit: companyNameToDelta[companyRecord.name],
    }
    allRecord.push(record);
  }

  return allRecord;
}
