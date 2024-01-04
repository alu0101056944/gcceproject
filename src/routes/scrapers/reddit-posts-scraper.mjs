/**
 * @author Marcos Barrios
 * @since 02_01_2023
 * @desc Scraper for {@link https://www.reddit.com/r/programming/search/?q=react&restrict_sr=1&sort=new}
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';

import Sentiment from 'sentiment';

/**
 * Scraper for {@link https://www.reddit.com/r/programming/search/?q=react&restrict_sr=1&sort=new}
 */
export default class RedditPostsScrapper {
  /** @private @constant  */
  #scraper = undefined;
  #outputObject = undefined;
  #firstURL = undefined;
  #hasVisitedFirstPage = undefined;
  #sentimentAnalyzer = undefined;

  constructor(firstURL) {
    this.#outputObject = [];
    this.#firstURL = firstURL;
    this.#hasVisitedFirstPage = false;
    this.#sentimentAnalyzer = new Sentiment();

    const requestHandler = this.#myHandler.bind(this);
    this.#scraper = new PlaywrightCrawler({
      headless: true,
      navigationTimeoutSecs: 100000,
      requestHandlerTimeoutSecs: 100000,
      browserPoolOptions: {
        closeInactiveBrowserAfterSecs: 100000,
        operationTimeoutSecs: 100000,
      },
      requestHandler,
      retryOnBlocked: true,
      maxConcurrency: 1,
      sessionPoolOptions: {
        blockedStatusCodes: [404],
      },
      maxRequestRetries: 2,
    });
  }

  async #myHandler({ page, request, enqueueLinks, infiniteScroll }) {
    log.info('RedditPostsScrapper visited page: ' + request.url);

    await page.waitForLoadState();

    if (!this.#hasVisitedFirstPage) {
      const publication = page.locator('post-consume-tracker');
      let allPublications = await publication.all();

      await infiniteScroll({
        stopScrollCallback: async () => {
          allPublications = await publication.all();
          return allPublications.length > 20;
        }
      });

      await enqueueLinks({ regexps: [/\/r\/\w+?\/comments\//] });
      this.#hasVisitedFirstPage = true;
    } else {
      const shreddingCommentLocator = page.locator('shreddit-comment')
          .filter({ has: page.locator('p') }).locator('p');
      const allComment = await shreddingCommentLocator.all();

      const allCommentText = [];
      for await (const commentText of allComment.map(l => l.textContent())) {
        allCommentText.push(commentText.trim());
      }

      const allSentiment =
          allCommentText.map(t => this.#sentimentAnalyzer.analyze(t));

      const TOTAL_SENTIMENT = allSentiment
          .reduce((acc, sent) => acc + sent.score, 0);
      if (TOTAL_SENTIMENT > 0) {
        const MEAN_SENTIMENT = allSentiment
        .map((sent) => sent.score / TOTAL_SENTIMENT)
        .reduce((acc, sent) => acc + sent, 0);

        this.#outputObject.push(MEAN_SENTIMENT);
      } else {
        this.#outputObject.push(0);
      }
    }
  };

  async run() {
    await this.#scraper.run([this.#firstURL]);
    return this.#outputObject;
  }
}
