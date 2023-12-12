/**
 * @author Marcos Barrios
 * @since 28_10_2023
 * @desc Test whether GithubRepositoryScraper works
 */

'use strict';

import { inspect } from 'util';
import GithubRepositoryScraper from '../../routes/scrapers/github-repository-scraper.mjs';

export default function addContributors() {
  const urls = [
    'https://github.com/alu0101056944/gcceproject/', // without contributors
    'https://github.com/facebook/react', // with contributors
  ];
  const scraper = new GithubRepositoryScraper(urls);
  scraper.run().then(() => console.log(inspect(scraper.getOutputObject())));
}

// addContributors();
