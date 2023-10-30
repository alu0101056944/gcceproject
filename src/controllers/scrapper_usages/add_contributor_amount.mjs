/**
 * @author Marcos Barrios
 * @since 28_10_2023
 * @desc Test whether GithubRepositoryScrapper works
 */

'use strict';

import { inspect } from 'util';
import GithubRepositoryScrapper from '../../routes/github-repository-scrapper.mjs';

export default function addContributors() {
  const urls = [
    'https://github.com/alu0101056944/gcceproject/', // without contributors
    'https://github.com/facebook/react', // with contributors
  ];
  const scrapper = new GithubRepositoryScrapper(urls);
  scrapper.run().then(() => console.log(inspect(scrapper.getOutputObject())));
}

// addContributors();
