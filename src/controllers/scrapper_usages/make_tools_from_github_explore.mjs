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

export default async function makeToolsTableWithoutIdFromGithubExploreScrapper(allSpecialization) {
  const allRecord = [];
  const repoNameToURL = {};
  for (const specialization of allSpecialization) {
    const scrapper = new GithubExploreScrapper(`https://github.com/topics/${specialization}`);
    const output = await scrapper.run();
    if (output.forEach) {
      output.forEach((entry) => {
          allRecord.push({
              name: entry.name.toLowerCase(),
              author_company: entry.author_company,
              specialization,
              type: entry.type,
            });

          repoNameToURL[entry.name] = entry.url;
        });

    }
  }
  return { allRecord, repoNameToURL, };
}
