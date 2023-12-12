/**
 * @author Marcos Barrios
 * @since 29_10-2023
 * @desc Test whether GithubDependenciesScraper works.
 */

'use strict';

import { inspect } from 'util';
import GithubDependenciesScraper from '../../routes/scrapers/github-dependencies-scraper.mjs';

export default function addDependencies() {
  const allrepositoryInfos = [
    {
      name: 'react',
      author_company: 'facebook'
    },
    {
      name: 'gatsbyjs',
      author_company: 'gatsby',
    }
  ];
  const scraper = new GithubDependenciesScraper(allrepositoryInfos);
  scraper.setOutputLength(1);
  scraper.setMaxAmountOfPageSurfs(2);
  scraper.run().then((data) => console.log(inspect(data)));
}

addDependencies();
