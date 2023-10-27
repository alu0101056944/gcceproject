/**
 * @author Marcos Barrios
 * @since 24_10_2023
 * @desc Build a time table
 */

'use strict';

import GoogleTrendsScrapper from "../routes/google-trends-scrapper.mjs";

export default function addInterest() {
  const searchTerms = [
    'rafa nadal',
    'roger federer',
    'naranja',
    'manzana',
  ];
  // IMPORTANT: because first term is always 429, then pad the array and
  // put a trash search term first before using.
  const scrapper = new GoogleTrendsScrapper(searchTerms);
  scrapper.run();
}

addInterest();
