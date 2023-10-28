/**
 * @author Marcos Barrios
 * @since 28_10_2023
 * @desc Test whether NPMJSScrapper works
 */

'use strict';

import { inspect } from 'util';
import NPMJSScrapper from '../routes/npmjs-scrapper.mjs';

export default function addDownloads() {
  const packageNames = [
    'react',
    'eslint-plugin-react',
  ];
  const scrapper = new NPMJSScrapper(packageNames);
  scrapper.run().then(() => console.log(inspect(scrapper.getOutputObject())));
}

addDownloads();
