'use strict';

import { inspect } from 'util';

import ForcedTimeoutScrapper from './timeout-catch-attempt.mjs';

export default async function execute() {
  const packageNames = [
    'react',
    'documentation'
  ];

  const forcedTimeoutScrapper = new ForcedTimeoutScrapper(packageNames);
  const packageDownloads = await forcedTimeoutScrapper.run();
  console.log(inspect(packageDownloads));
}

execute();
