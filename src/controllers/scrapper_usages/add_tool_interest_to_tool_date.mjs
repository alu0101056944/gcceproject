/**
 * @author Marcos Barrios
 * @since 24_10_2023
 * @desc Build a time table
 */

'use strict';

import GoogleTrendsScrapper from "../../routes/google-trends-scrapper.mjs";

import { inspect } from 'util';

export default async function addInterest() {
  const searchTerms = [
    'foo',
    "DIY Robotics",
    "Handcrafted Robots",
    "Custom Robot Projects",
    "Homebuilt Robotics",
    "AI Hobbyist Projects",
    "Personal Robotics Creations",
    "Unique Robot Designs",
    "Experimental Robotics",
    "Smart Machines Crafts",
    "Robotics Enthusiast Marketplace",
    "DIY Intelligent Agents",
    "Innovative Robotics",
    "Creative AI Prototypes",
    "Tech DIY Projects",
    "Robot Collectibles"
  ];

  // IMPORTANT: because first term is always 429, then pad the array and
  // put a trash search term as first element.

  const scrapper = new GoogleTrendsScrapper(searchTerms);
  const output = await scrapper.run();
  console.log(inspect(output));
}

addInterest();
