/**
 * @author Marcos Barrios
 * @since 22_10_2023
 * @desc Build a tool table
 */

'use strict';

import GithubExploreScrapper from "../routes/github-explore-scrapper.mjs";

const types = [
  'language',
  'testing',
  'db',
  'editor',
  ['machine-learning', 'deep-learning', 'deep-neural-networks'],
  'code-quality',
  'code-review',
  'compiler',
  'continuous-integration',
  'devops',
  'documentation',
];

const specializations = [
  'front-end',
  'back-end',
  'embedded',
  'devops',
];

const scrapper = new GithubExploreScrapper('https://github.com/topics/embedded');
scrapper.run();
