/**
 * @author Marcos Barrios
 * @since 27_10_2023
 * @desc Fill company table.
 */

'use strict';

import CompaniesmarketcapScraper from "../../routes/scrapers/companiesmarketcap-scraper.mjs";

import { inspect } from 'util';

export default function addCompanies() {
  const scraper = new CompaniesmarketcapScraper();
  scraper.run().then(() => console.log(inspect(scraper.getOutputObject())));
}

// addCompanies();
