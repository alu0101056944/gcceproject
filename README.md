# Project for the first part of *Gestión de la Comunicación y Conocimiento Empresarial* subject

A business intelligence tool to help select tools for a project as a hyphotetical consulting IT firm.

## Index

 - [TODO](#todo)

## TODO

 - at [src\controllers\tables\fact\make_market_date_table.mjs](src\controllers\tables\fact\make_market_date_table.mjs) differentiate between all markets because right know all markets get the same `amount_of_offers_attribute`.
 - at [src\controllers\tables\fact\make_community_tool_date_table.mjs](src\controllers\tables\fact\make_community_tool_date_table.mjs) rank is tempirarily NULL. Think about how to calculate a rank.
 - Make paralel runs on insert table with a `Promise.all`.
 - at [src\controllers\tables\dimension\make_project_table.mjs](src\controllers\tables\dimension\make_project_table.mjs) think about the logic for when project names are not github project names.
 - at [src\routes\scrapers\github-explore-scraper.mjs](src\routes\scrapers\github-explore-scraper.mjs) find out why sometimes headerInfo[i].type throws errors, it's a race condition.
 - at [\src\controllers\tables\fact\make_project_tool_table.mjs](\src\controllers\tables\fact\make_project_tool_table.mjs) think on how to diferentiate tool from project
 - at [src\controllers\tables\fact\make_project_company_table.mjs](src\controllers\tables\fact\make_project_company_table.mjs) Use scraper instead, it's probably faster than doing many api requests.
 - at [src\routes\scrapers\google-trends-scraper.mjs](src\routes\scrapers\google-trends-scraper.mjs) find out how to make it faster, for 20000 searches at 3 seconds per search it takes 111 minutes for completion.b

## How to use persistent ids

There is a [src/persistent_ids.json](./src/persistent_ids.json) that keeps track of how many records have been created for each dimension. The objective is to not have duplicated id's, even tho I will probably just use the project names as primary keys after orchestration.

Although for the manual tables like community, market, employee then the persistent id's will remain the same over each run.

## References

 - [Locate parent in playwright](https://playwrightsolutions.com/how-do-you-locate-the-parent-of-an-element-with-playwright/)
