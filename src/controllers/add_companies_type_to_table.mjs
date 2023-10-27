/**
 * @author Marcos Barrios
 * @since 27_10_2023
 * @desc Output the type of the given companies.
 */

'use strict';

import CompaniesmarketcapProfileScrapper from '../routes/companiesmarketcap-profile-scrapper.mjs';
import CompaniesmarketcapScrapper from '../routes/companiesmarketcap-scrapper.mjs';

import { inspect } from 'util';

export default async function addCompanies() {
  const scrapperOfCompanies = new CompaniesmarketcapScrapper();
  const companiesEmployeeAmount = await scrapperOfCompanies.run();
  const scrapper = new CompaniesmarketcapProfileScrapper();
  const companiesType = await scrapper.run();
  
}

addCompanies();
