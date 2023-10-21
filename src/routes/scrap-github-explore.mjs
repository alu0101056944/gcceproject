/**
 * @author Marcos Barrios
 * @since 20_10_2023
 * @desc Scrap items from any Github Explore topic.
 *
 * @see {@link https://github.com/topics/frontend} for the webpage it was tested
 *  on.
 */

'use strict';

import { PlaywrightCrawler, purgeDefaultStorages } from "crawlee";

const crawler = new PlaywrightCrawler({
  async requestHandler({ page, request, enqueueLinks }) {
    await purgeDefaultStorages();
    const topicTitleContainer =
        await page.waitForSelector('.gutter-md .d-flex.flex-1 .h1')
    const topicTitleHandler = await topicTitleContainer.textContent();
    const topicTitle = topicTitleHandler.trim();
    console.log('Title: ' + topicTitle);
    const mapNameAndAuthor = await makeArrayOfUsefulInfo(page);
    mapNameAndAuthor.forEach((e) => console.log(`${e.name}/${e.author}`));
  }
});

async function makeArrayOfUsefulInfo(page) {
  const allNameAndAuthorHandlers = await page.$$('article div.d-flex.flex-1 h3')
  const mapNameAndAuthor = await Promise.all(
    allNameAndAuthorHandlers.map((elementHandler) => {
      return (async () => {
        const allHandlersOfLink = await elementHandler.$$('a');
        const nameLinkHandler = await allHandlersOfLink[0].textContent();
        const name = nameLinkHandler.trim();
        const authorLinkHandler = await allHandlersOfLink[1].textContent();
        const author = authorLinkHandler.trim();
        return { name, author };
      })();
    })
  );
  return mapNameAndAuthor;
}

crawler.run(['https://github.com/topics/frontend']);
