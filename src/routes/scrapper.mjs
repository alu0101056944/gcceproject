/**
 * @author Marcos Barrios
 * @since 10_10_2023
 */

'use strict';

import { CheerioCrawler, KeyValueStore, purgeDefaultStorages } from "crawlee";

async function execute() {
  await purgeDefaultStorages();
  const myMapStore = await KeyValueStore.open('foo');

  const crawler = new CheerioCrawler({
    maxRequestsPerCrawl: 5,
    async requestHandler({ $, request, enqueueLinks }) {
      const title =  $('title').text();
      console.log('This is a test, title: ' + title + ' at' + request.loadedUrl);
      await myMapStore.setValue('somevalue', {xyzz: 'something'});
      await enqueueLinks({
        strategy: 'same-domain'
      });
    },
  });
  crawler.run(['https://crawlee.dev/']);
}

execute();