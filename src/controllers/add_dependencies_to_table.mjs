/**
 * @author Marcos Barrios
 * @since 29_10-2023
 * @desc Test whether GithubDependenciesScrapper works.
 */

'use strict';

import { inspect } from 'util';
import GithubDependenciesScrapper from '../routes/github-dependencies-scrapper.mjs';

export default function addDependencies() {
  const allrepositoryInfos = [
    {
      name: 'react',
      author: 'facebook'
    }
  ];
  const scrapper = new GithubDependenciesScrapper(allrepositoryInfos);
  scrapper.setMaxAmountfPageSurfs(5);
  scrapper.run().then(() => console.log(inspect(scrapper.getOutputObject())));
}

addDependencies();
