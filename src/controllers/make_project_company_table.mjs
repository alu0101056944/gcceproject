/**
 * @author Marcos Barrios
 * @since 09_11_2023
 * @desc Make project company table
 */

'use strict';

import makeToolsFromGithubExplore from './scrapper_usages/add_tool_entries_to_table.mjs'

export default async function makeProjectCompany() {
  const specializations = [
    'frontend',
    // 'backend',
    // 'embedded',
    // 'devops',
  ];
  const { urlsObject } = (await makeToolsFromGithubExplore(specializations));
};
