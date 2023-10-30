/**
 * @author Marcos Barrios
 * @since 22_10_2023
 * @desc Add entries to tool table.
 */

'use strict';

import GithubExploreScrapper from "../../routes/github-explore-scrapper.mjs";

import pgPromise from 'pg-promise';
const pgp = pgPromise();
const db = pgp({
  connectionString: 'postgres://postgres:foo@localhost:5432/raw_database',
  max: 20
});

export default function addToolEntries() {
  const specializations = [
    'front-end',
    'back-end',
    'embedded',
    'devops',
  ];
  const tableObject = {};
  specializations.forEach((specialization) => {
    const scrapper = new GithubExploreScrapper(`https://github.com/topics/${specialization}`);
    scrapper.run();
    // persistent id handling
    // parse the object
    // add specialization to the object
    // etc
  });
}
