/**
 * @author Marcos Barrios
 * @since 29_10-2023
 * @desc Test whether GithubDependenciesScrapper works.
 */

'use strict';

import { inspect } from 'util';
import GithubDependenciesScrapper from '../../routes/github-dependencies-scrapper.mjs';

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
  const scrapper = new GithubDependenciesScrapper(allrepositoryInfos);
  scrapper.setOutputLength(1);
  scrapper.setMaxAmountOfPageSurfs(2);
  scrapper.run().then((data) => console.log(inspect(data)));
}

addDependencies();
