async function fetchContributorAmount(authorCompany, repoName) {
  async function* fetchContributors() {
    let url =
        `https://api.github.com/repos/${authorCompany}/${repoName}/contributors`;
    while (url) {
      const response = await fetch(url, {
            headers: {
              'User-Agent': 'Our script',
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
            }
          });
  
      const body = await response.json();
      yield body.length;
  
      const ALL_LINKS_STRING = response.headers.get('Link');
      const EXTRACT_NEXT_URL_REG_EXP = /<([^\s]+?)>; rel="next"/;
      url = ALL_LINKS_STRING?.match(EXTRACT_NEXT_URL_REG_EXP)?.[1];
    }
  }

  const iterator = fetchContributors(repoName);
  let count = 0;
  for await (const partialAmount of iterator) {
    count += partialAmount;
  }
  return count === 0 ? null : count;
}

(async () => {
  console.log(await fetchContributorAmount('facebook', 'react'));
})();
