/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @description Make tool table.
 * 
 */

'use strict';

import { writeFile } from 'fs/promises'

import GithubExploreScraper from '../../../../../routes/scrapers/github-explore-scraper.mjs';

export default async function makeToolTable(latestId) {
  console.log('Calculating toolTable');

  const allRecord = [];

  const allSpecialization = [
    'frontend',
  ];

  try {
    for (const specialization of allSpecialization) {
      const scraper = new GithubExploreScraper(`https://github.com/topics/${specialization}`);
      const allRepoInfo = await scraper.run();
      allRepoInfo.forEach(info => {
        ++latestId;
        allRecord.push(
          {
            tool_id: latestId,
            name: info.name,
            author_company: info.author_company,
            specialization,
            type: info.type,
          }
        )
      });
    }
  } catch (error) {
    console.error('There was an error while calculating toolTable' + error);
  }

  return allRecord;
}
