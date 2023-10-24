/**
 * @author Marcos Barrios
 * @since 24_10_2023
 * @desc Build a time table
 */

'use strict';

import GoogleTrendsScrapper from "../routes/google-trends-scrapper.mjs";

export default function addInterest() {
  const URL = 'https://google.com';
  const scrapper = new GoogleTrendsScrapper(URL);
  scrapper.run();
}

addInterest();
