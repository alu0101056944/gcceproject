# Project for the first part of *Gestión de la Comunicación y Conocimiento Empresarial* subject

This project makes output tables from information obtained through web scraping different programming library sources. Right now it is able to gather the following information:

- Github repository development history.
- Downloads per week (npm, pip) of the corresponding github repository.
- Linkedin job posting mention amount of the corresponding github repository.
- reddit/r/programming mention amount of the corresponding github repository.
- employee amount, stock delta, budget estimations of each github repository's author (by assumming that it is an organization).
- Tool type (by tag checking) and specialization (by search term to find it) of the correspondding github repository.

Which allows knowing:
+ How well is the github repository's development going.
+ Relevance of the repository in the current market (linkedin, reddit.com/r/programming)
+ How is the author's trajectory evolving (in some cases).

It's meant to serve as a school project aimed at exploring business intelligence concepts. The project involves role-playing a consulting IT firm seeking to make informed decisions about tooling.

## Index

 1. [Requirements](#requirements)
 2. [TODO](#todo)

## Requirements

A `GITHUB_TOKEN` environment variable must be set in a `.env` file.

## TODO
 - at [src\controllers\tables\fact\make_market_tool_date_table.mjs](src\controllers\tables\fact\make_market_tool_date_table.mjs) differentiate between markets.
 - at [src\controllers\tables\source\github\fact\make_project_tool_table.mjs](src\controllers\tables\source\github\fact\make_project_tool_table.mjs) Update make project tool table's outputLength 
 - at [src\controllers\tables\source\linkedin\fact\make_community_tool_date_table.mjs](src\controllers\tables\source\linkedin\fact\make_community_tool_date_table.mjs) make sure on orchestration that duplicates are handled properly.
 - at [src\controllers\tables\fact\make_market_date_table.mjs](src\controllers\tables\source\linkedin\fact\make_market_date_table.mjs) differentiate between all markets because right know all markets get the same `amount_of_offers_attribute`.
 - at [src\controllers\tables\source\linkedin\fact\make_community_tool_date_table.mjs](src\controllers\tables\source\linkedin\fact\make_community_tool_date_table.mjs) rank is temporarily NULL. Think about how to calculate a rank.
 - at [src\routes\scrapers\github-explore-scraper.mjs](src\routes\scrapers\github-explore-scraper.mjs) find out why sometimes headerInfo[i].type throws errors, it's a race condition.
 - at [src\controllers\tables\fact\make_project_company_table.mjs](src\controllers\tables\fact\make_project_company_table.mjs) Use scraper instead, it's probably faster than doing many api requests.
 - at [src\routes\scrapers\google-trends-scraper.mjs](src\routes\scrapers\google-trends-scraper.mjs) find out how to make it faster, for 20000 searches at 3 seconds per search it takes 111 minutes for completion.b
