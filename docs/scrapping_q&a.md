
- [Good resource on web scraping (Python but I am interested in the concepts)](https://thepythonscrapyplaybook.com/)

#### What technologies are most used for web scraping nowadays in Node.js?

Puppeteer(If I need advanced features like event handling and websites that get content from JS), Playwright, cheerio (raw HTML, XML manipulation), Nightmare.js(small, subjective suggestion), crawler.

#### In Cheerio, the `$` object is the parsed webpage, but what is it's structure like?

A string selector is passed as argument. Each object is a Cheerio DOM like object, with methods like `attr()`, `.text()`, `.html()`, `parent()`, `children()`, `next()`, etc.

*Note:* `attr()` outputs a Cheerio DOM like object, so I must use `get()` to get the actual value.

#### In the CheerioCrawler example, What is the first argument in the `map()` function call?

In this code snippet:

```js
import { CheerioCrawler } from 'crawlee';
import { URL } from 'node:url';

const crawler = new CheerioCrawler({
    // Let's limit our crawls to make our
    // tests shorter and safer.
    maxRequestsPerCrawl: 20,
    async requestHandler({ request, $ }) {
        const title = $('title').text();
        console.log(`The title of "${request.url}" is: ${title}.`);

        // Without enqueueLinks, we first have to extract all
        // the URLs from the page with Cheerio.
        const links = $('a[href]')
            .map((_, el) => $(el).attr('href'))
            .get();

        // Then we need to resolve relative URLs,
        // otherwise they would be unusable for crawling.
        const absoluteUrls = links.map(
            (link) => new URL(link, request.loadedUrl).href
        );

        // Finally, we have to add the URLs to the queue
        await crawler.addRequests(absoluteUrls);
    },
});

await crawler.run(['https://crawlee.dev']);
```

there is the part:

```js
const links = $('a[href]')
            .map((_, el) => $(el).attr('href'))
            .get();
```

And the first argument of `map()` is the index, while the second is the actual element, so the `map()` in a cheerio DOM object has MDN's map inverted parameters, which is normally `element, index`.

