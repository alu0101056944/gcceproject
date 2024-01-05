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

/**
 * 
 * @param {array} companyTable of company record objects
 * @param {array} projectTable of project record objects
 * @param {array} allRelation of objects with author_company and name
 *    properties that relate one company (author_company) to one project (name).
 */
export default async function makeProjectCompanyTable(companyTable, projectTable,
    allRelation) {
  const projectCompanyTable = [];

  for (let i = 0; i < allRelation.length; i++) {
    const REPO_NAME = allRelation[i].name;
    const AUTHOR_COMPANY = allRelation[i].authorCompany;

    const PROJECT_CONTRIBUTOR_AMOUNT =
        fetchContributorAmount(AUTHOR_COMPANY, REPO_NAME);

    const AVERAGE_INCOME_PER_HOUR = 37;
    const ARBITRARY_PROJECT_DURATION_IN_YEARS = 5;
    const BUDGET_ESTIMATED =
        PROJECT_CONTRIBUTOR_AMOUNT * AVERAGE_INCOME_PER_HOUR *
        ARBITRARY_PROJECT_DURATION_IN_YEARS;

    projectCompanyTable.push({
      project_id: repoNameToId[REPO_NAME],
      company_id: authorCompanyToId[AUTHOR_COMPANY],
      budget: BUDGET_ESTIMATED,
      amount_of_employees_assigned: PROJECT_CONTRIBUTOR_AMOUNT,
    });
  }

  return projectCompanyTable;
};
