/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @description Make community table.
 * 
 * Make community table is not dynamic because on must know what the relevant
 * communities are. In this program, a community is considered a webpage with
 * information about tools, and which communities are relevant must be known
 * beforehand because each requires specific scrapers.
 *
 */

'use strict';

export default async function makeCommunityTable() {
  console.log('Calculating communityTable');

  const allRecord = [];

  allRecord.push([
    {
      community_id: 1,
      name: 'github',
      type: 'Open Source Hosting',
    },
  ]);

  return allRecord;
}
