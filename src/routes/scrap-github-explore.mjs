/**
 * @author Marcos Barrios
 * @since 20_10_2023
 * @desc Scrap items from any Github Explore topic.
 *
 */

'use strict';

import { PlaywrightCrawler, purgeDefaultStorages } from "crawlee";

const crawler = new PlaywrightCrawler({
  async requestHandler({ page, request, enqueueLinks }) {
    await purgeDefaultStorages();
    const topicTitleContainer =
        await page.waitForSelector('.gutter-md .d-flex.flex-1 .h1')
    const topicTitle = await topicTitleContainer.textContent();
    console.log('Title: ' + topicTitle);
    const allNameAndAuthorHandlers = await page.$$('article div.d-flex.flex-1 h3')
    const mapNameAndAuthor = await Promise.all(
      allNameAndAuthorHandlers.map((elementHandler) => {
          (async () => {
            const allHandlersOfLink = await elementHandler.$$('a');
            const nameLinkHandler = await allHandlersOfLink[0].textContent();
            console.log();
            const name = nameLinkHandler.trim();
            const authorLinkHandler = await allHandlersOfLink[1].textContent().trim();
            const author = authorLinkHandler.trim();
            return { name, author };
          })();
        })
      );
    mapNameAndAuthor.forEach((e) => console.log(`${e.name}/${e.author}`));
  }
});

crawler.run(['https://github.com/topics/frontend']);
