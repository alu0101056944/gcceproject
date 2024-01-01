
import NamesToURLScraper from "../../routes/scrapers/names-to-urls-scraper.mjs";

export default async function getAllLatestVersionChanges(allRepository) {
  const URL_PREFIX = 'https://github.com/';
  const URL_POSTFIX = '/releases';
  const scraperRepositoryInfo = new NamesToURLScraper(
    {
      names: allRepository,
      preUrl: URL_PREFIX,
      postUrl: URL_POSTFIX,
    },
    async ({ page, request, log, outputObject }) => {
      log.info('GithubLatestFiveVersionsScraper visited ' + request.url);

      outputObject[request.label] ??= [];

      const linkLocator = page.getByRole('link');
      const allLinkLocator = await linkLocator.all();
      let count = 0;
      for (let i = 0; i < allLinkLocator.length; i++) {
        if (count >= 5) {
          break;
        }
        const HREF_STRING = await ((allLinkLocator[i]).getAttribute('href'));
        if (HREF_STRING.match(/\/(\w+?)\/(\w+?)\/releases\/tag/)) {
          const RELEASE_VERSION =
              (await ((allLinkLocator[i]).textContent())).trim();
          outputObject[request.label].push(RELEASE_VERSION);
          count++;
        }
      }
    },
  );
  scraperRepositoryInfo.create();
  const output = await scraperRepositoryInfo.run();
  return output;
}
