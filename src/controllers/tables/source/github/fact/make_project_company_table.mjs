/**
 * @author Marcos Barrios
 * @since 09_11_2023
 * @desc Make project company table
 */

'use strict';

// Update README.md if changed to scraper usage instead of api calls.
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

export default async function makeProjectCompanyTable(toolTable,
    projectTable, companyTable) {

  console.log('Calculating projectCompanyTable');

  const allRecord = [];

  try {
    if (toolTable.length !== projectTable.length ||
        toolTable.length !== companyTable.length ||
        projectTable.length !== companyTable.length) {
      throw new Error('All lengths should be the same. ' +
          'toolTable.length: ' + toolTable.length + ', ' +
          'projectTable.length: ' + projectTable.length + ', ' +
          'companyTable.length: ' + companyTable.length);
    }

    for (let i = 0; i < toolTable.length; i++) {
      const REPO_NAME = toolTable[i].name;
      const AUTHOR_COMPANY = toolTable[i].author_company;

      const PROJECT_CONTRIBUTOR_AMOUNT =
          await fetchContributorAmount(AUTHOR_COMPANY, REPO_NAME);

      const AVERAGE_INCOME_PER_HOUR = 37;
      const ARBITRARY_PROJECT_DURATION_IN_YEARS = 5;
      const BUDGET_ESTIMATED =
          PROJECT_CONTRIBUTOR_AMOUNT * AVERAGE_INCOME_PER_HOUR *
          ARBITRARY_PROJECT_DURATION_IN_YEARS;

      allRecord.push({
        project_id: projectTable[i].project_id,
        company_id: companyTable[i].company_id,
        budget: BUDGET_ESTIMATED,
        amount_of_employees_assigned: PROJECT_CONTRIBUTOR_AMOUNT,
      });
    }
  } catch (error) {
    console.error('There was an error while calculating projectCompanyTable' +
        error);
  }

  return allRecord;
};
