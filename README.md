# Project for the first part of *Gestión de la Comunicación y Conocimiento Empresarial* subject

A business intelligence tool to help select tools for a project as a hyphotetical consulting IT firm.

## TODO

 - at [src\controllers\tables\dimension\make_project_table.mjs](src\controllers\tables\dimension\make_project_table.mjs) think about the logic for when project names are not github project names.
 - at [src\routes\scrapers\github-explore-scraper.mjs](src\routes\scrapers\github-explore-scraper.mjs) find out why sometimes headerInfo[i].type throws errors, it's a race condition.
 - at [\src\controllers\tables\fact\make_project_tool_table.mjs](\src\controllers\tables\fact\make_project_tool_table.mjs) think on how to diferentiate tool from project
 - at [src\controllers\tables\fact\make_project_company_table.mjs](src\controllers\tables\fact\make_project_company_table.mjs) Use scraper instead, it's probably faster than doing many api requests.
 - at [src\routes\scrapers\google-trends-scraper.mjs](src\routes\scrapers\google-trends-scraper.mjs) find out how to make it faster, for 20000 searches at 3 seconds per search it takes 111 minutes for completion.
