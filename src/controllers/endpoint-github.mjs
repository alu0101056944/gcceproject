/**
 * @author Marcos Barrios
 * @since 06_01_2024
 * @description Meant to allow different sources of records for the same
 *    tables throuh the EndpointWriter class. This one handles the github source.
 */

'use strict';

import EndpointWriter from './endpoint_writer.mjs';

import { readFile } from 'fs/promises';

import makeCompanyTable from './tables/source/github/dimension/make_company_table.mjs';
import makeProjectTable from './tables/source/github/dimension/make_project_table.mjs';
import makeToolTable from './tables/source/github/dimension/make_tool_table.mjs';

import makeCommunityToolDateTable from './tables/source/github/fact/make_community_tool_date_table.mjs';
import makeCommunityToolTable from './tables/source/github/fact/make_community_tool_table.mjs';
import makeProjectCompanyTable from './tables/source/github/fact/make_project_company_table.mjs';
import makeProjectToolTable from './tables/source/github/fact/make_project_tool_table.mjs';
import makeToolDateTable from './tables/source/github/fact/make_tool_date_table.mjs';
import makeToolProjectCompanyTable from './tables/source/github/fact/make_tool_project_company_table.mjs';

async function getDependencyTreeForGithubRecords() {
  const allDependencyTree = [
    {
      tableName: 'project',
      resolver: async (toolTable, latestId) => {
        const table = await makeProjectTable(toolTable, latestId);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return table;
      },
      dependencies: [
        {
          tableName: 'tool',
          resolver: async (latestId) => {
            const table = await makeToolTable(latestId);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return table;
          },
          dependencies: [],
        },
      ],
    },

    {
      tableName: 'company',
      resolver: async (toolTable, latestId) => {
        const table = await makeCompanyTable(toolTable, latestId);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return table;
      },
      dependencies: [ { useTable: 'tool' } ],
    },

    {
      tableName: 'communityToolDate',
      resolver: async (toolTable, latestId) => {
        const TODAY_DATE_TABLE =
        await readFile('outputTables/todayDateTable.json', 'utf8');
        const todayDateTable = JSON.parse(TODAY_DATE_TABLE);
        const TODAY_ID = todayDateTable[0].date_id;

        const FILE_CONTENT =
            await readFile('outputTables/communityTable.json', 'utf8');
        const communityTable = JSON.parse(FILE_CONTENT)
        const table = await makeCommunityToolDateTable(toolTable, communityTable,
            TODAY_ID);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return table;
      },
      dependencies: [ { useTable: 'tool' } ],
    },

    {
      tableName: 'communityTool',
      resolver: async (toolTable) => {
        const table = await makeCommunityToolTable(toolTable);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return table;
      },
      dependencies: [ { useTable: 'tool' } ],
    },

    {
      tableName: 'projectCompany',
      resolver: async (toolTable, projectTable, companyTable) => {
        const table = await makeProjectCompanyTable(toolTable, projectTable,
            companyTable);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return table;
      },
      dependencies: [
        { useTable: 'tool' },
        { useTable: 'project' },
        { useTable: 'company' },
      ],
    },

    {
      tableName: 'projectTool',
      resolver: async (toolTable, projectTable) => {
        const table = await makeProjectToolTable(toolTable, projectTable);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return table;
      },
      dependencies: [
        { useTable: 'tool' },
        { useTable: 'project' },
      ],
    },

    {
      tableName: 'toolDate',
      resolver: async (toolTable) => {
        const FILE_CONTENT =
            await readFile('outputTables/todayDateTable.json', 'utf8');
        const todayDateTable = JSON.parse(FILE_CONTENT);
        const TODAY_ID = todayDateTable[0].date_id;
        const table = await makeToolDateTable(toolTable, TODAY_ID);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return table;
      },
      dependencies: [ { useTable: 'tool' } ],
    },

    {
      tableName: 'toolProjectCompany',
      resolver: async (toolTable, projectTable, companyTable) => {
        const table = await makeToolProjectCompanyTable(toolTable,
            projectTable, companyTable);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return table;
      },
      dependencies: [
        { useTable: 'tool' },
        { useTable: 'project' },
        { useTable: 'company' },
      ],
    },
  ];

  return allDependencyTree;
}

// make sure this is executed after community table has been created.
export default async function endpointGithub() {
  const allDependencyTree = await getDependencyTreeForGithubRecords();
  const writer = new EndpointWriter(allDependencyTree)
  await writer.parse();
}
