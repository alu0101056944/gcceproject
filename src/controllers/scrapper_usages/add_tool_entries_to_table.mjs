/**
 * @author Marcos Barrios
 * @since 22_10_2023
 * @desc Add entries to tool table.
 */

'use strict';

import GithubExploreScrapper from "../../routes/github-explore-scrapper.mjs";

// import pgPromise from 'pg-promise';
// const pgp = pgPromise();
// const db = pgp({
//   connectionString: 'postgres://postgres:foo@localhost:5432/raw_database',
//   max: 20
// });

export default async function makeToolsFromGithubExplore() {
  const specializations = [
    'front-end',
    'back-end',
    'embedded',
    'devops',
  ];
  const tableObject = [];
  for (const specialization of specializations) {
    const scrapper = new GithubExploreScrapper(`https://github.com/topics/${specialization}`);
    const output = await scrapper.run();
    output.forEach((entry) => tableObject.push({
          name: entry.name,
          author_company: entry.author_company,
          specialization,
          type: entry.type,
        }));
  }
  return tableObject;
}
