/**
 * @author Marcos Barrios
 * @since 20_10_2023
 * @desc Scrap items from any Github Explore topic.
 *
 * @see {@link https://github.com/topics/frontend} for the webpage it was tested
 *  on.
 */

'use strict';

import { PlaywrightCrawler, purgeDefaultStorages, Configuration } from 'crawlee';
import { load } from 'cheerio'

Configuration.set('headless', true);

const crawler = new PlaywrightCrawler({
  async requestHandler({ page, request, enqueueLinks }) {
    await purgeDefaultStorages();
    const topicTitleContainer =
        await page.waitForSelector('.gutter-md .d-flex.flex-1 .h1')
    const topicTitleHandler = await topicTitleContainer.textContent();
    const topicTitle = topicTitleHandler.trim();
    console.log('Title: ' + topicTitle);
    const AMOUNT_OF_RESULTS = await extractAmountOfResults(page);
    console.log(AMOUNT_OF_RESULTS);
    const mapNameAndAuthor = await makeArrayOfUsefulInfo(page);
    const INITIAL_AMOUNT_OF_RESULTS = mapNameAndAuthor.length;
    const moreButton = page.getByRole('button', { name: /Load.*more/i });
    // for (let i = 0; i < 40; i++) {
    //   await moreButton.click();
    // }
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

async function extractAmountOfResults(page) {
  const handlerOfTextWithAmount = await page.$('h2.h3.color-fg-muted');
  const TEXT_WITH_AMOUNT_OF_RESULTS = await handlerOfTextWithAmount.textContent();
  const AMOUNT_OF_RESULTS = parseFloat(
      TEXT_WITH_AMOUNT_OF_RESULTS.replace(',', '').match(/\d+/g)
    );
  return AMOUNT_OF_RESULTS;
}

crawler.run(['https://github.com/topics/frontend']);
