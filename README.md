# Project for the first part of *Gestión de la Comunicación y Conocimiento Empresarial* subject

A business intelligence tool to help select tools for a project as a hyphotetical consulting IT firm.

## Index

 - [TODO](#todo)

## TODO

 - at [src\controllers\tables\source\github\fact\make_project_tool_table.mjs](src\controllers\tables\source\github\fact\make_project_tool_table.mjs) Update make project tool table's outputLength 
 - at [src\controllers\tables\source\github\fact\make_community_tool_date_table.mjs](src\controllers\tables\source\github\fact\make_community_tool_date_table.mjs) make sure on orchestration that duplicates are handled properly.
 - Make sure that relation information is not lost; if i want to generate a tool and a project and a company per github repository, then have it as a branch and add to the actual final tool, project, company tables. Have these tables be an endpoint.
 - at [src/controllers/tables/fact/make_community_tool_table.mjs](src/controllers/tables/fact/make_community_tool_table.mjs) solve race condition into fetchAllCommitAmount.
 - at [src\controllers\tables\fact\make_market_date_table.mjs](src\controllers\tables\fact\make_market_date_table.mjs) differentiate between all markets because right know all markets get the same `amount_of_offers_attribute`.
 - at [src\controllers\tables\fact\make_community_tool_date_table.mjs](src\controllers\tables\fact\make_community_tool_date_table.mjs) rank is temporarily NULL. Think about how to calculate a rank.
 - Make parallel runs on insert table with a `Promise.all`.
 - at [src\routes\scrapers\github-explore-scraper.mjs](src\routes\scrapers\github-explore-scraper.mjs) find out why sometimes headerInfo[i].type throws errors, it's a race condition.
 - at [\src\controllers\tables\fact\make_project_tool_table.mjs](\src\controllers\tables\fact\make_project_tool_table.mjs) think on how to diferentiate tool from project.
 - at [src\controllers\tables\fact\make_project_company_table.mjs](src\controllers\tables\fact\make_project_company_table.mjs) Use scraper instead, it's probably faster than doing many api requests.
 - at [src\routes\scrapers\google-trends-scraper.mjs](src\routes\scrapers\google-trends-scraper.mjs) find out how to make it faster, for 20000 searches at 3 seconds per search it takes 111 minutes for completion.b

## How to use persistent ids

There is a [src/persistent_ids.json](./src/persistent_ids.json) that keeps track of how many records have been created for each dimension. The objective is to not have duplicated id's, even though I will probably just use the project names as primary keys on Apache Hop for the orchestration part.

## Annotations on loss of information

The 'useTable' node doesn't load the ENTIRE table, but only the one that is currently active in memory in the 'EndpointWriter' object.

Should it, though?

Maybe yes, in which case I have to update the error messages to make that fact clear, Because if I don't do it that way then I lose information and then have to spend resources to retrieve it, so it makes sense for each records source to have all the information at hand and store it by calling related make table functions. And if any table on another table that has created previously then I need to create a specific make table function for that source that includes the information needed. Basically there is no analyzing previously stored data to try to scrape info back, that is inneficient. Information is simply lost.

However, in some cases there is no need for source information. For example for the companyToolDate table, which simply needs all the tools so that it can get their name and count mentions on Linkedin. Another example is the companyDate table, which needs all the companies so that it can search the specific information it needs. In those cases it is enough to just allow a `readFile` on the outputTable, making sure that all the sources for that table have finished the record merge.

Another potential issue is that there may be too many records loaded in RAM, so the architecture should control the flow of information from the scrapers and pause temporarily while saving the current obtained records before making space for the extra records.

## References

 - [Locate parent in playwright](https://playwrightsolutions.com/how-do-you-locate-the-parent-of-an-element-with-playwright/)
