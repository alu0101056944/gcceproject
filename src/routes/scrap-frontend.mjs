/**
 * @author Marcos Barrios
 * @since 19_10_2023
 * @desc Scrape for the Tool table from Github Explore frontend topic.
 *
 * tool_id - name - author_company - specialization - license
 * 
 * The rest of rows I cannot get like this.
 */

'use strict';

import { CheerioCrawler, purgeDefaultStorages } from "crawlee";

const crawler = new CheerioCrawler({
  async requestHandler({ $, request, enqueueLinks }) {
    await purgeDefaultStorages();
    const topicTitle = $('.gutter-md .d-flex.flex-1 .h1').text().trim();
    console.log('Title: ' + topicTitle);
    
  }
});

crawler.run(['https://github.com/topics/frontend']);
