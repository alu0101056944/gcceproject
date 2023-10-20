/**
 * @author Marcos Barrios
 * @since 19_10_2023
 * @desc Scrap for the Tool table from Github Explore frontend topic.
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
    const allNameAndAuthor = $('article div.d-flex.flex-1 h3')
        .map((_, element) => {
          const children = $(element).children();
          const name = $(children.get(0)).text().trim();
          const author = $(children.get(1)).text().trim();
          return { name, author }
        })
        .toArray().forEach((e) => console.log(`${e.name}/${e.author}`));
  }
});

crawler.run(['https://github.com/topics/frontend']);
