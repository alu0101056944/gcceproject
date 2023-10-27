/**
 * @author Marcos Barrios
 * @since 27_10_2023
 * @desc Fill company table.
 */

'use strict';

import CompaniesmarketcapScrapper from "../routes/companiesmarketcap-scrapper.mjs";

import { inspect } from 'util';

export default function addCompanies() {
  const scrapper = new CompaniesmarketcapScrapper();
  scrapper.setMaxAmountfPageSurfs(5);
  scrapper.run().then(() => console.log(inspect(scrapper.getOutputObject())));
}

addCompanies();
