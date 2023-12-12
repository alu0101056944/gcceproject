
```bash
.
│   persistent_ids.json
│   README.md
│
├───controllers
│   │   get_date_record.mjs
│   │   insert_all_tables.mjs
│   │
│   ├───scraper_use_cases
│   │       add_companies_to_table.mjs
│   │       add_companies_type_to_table.mjs
│   │       add_contributor_amount.mjs
│   │       add_date_entry_to_table.mjs
│   │       add_dependencies_to_table.mjs
│   │       add_downloads_to_table.mjs
│   │       add_organization_contributors_to_table.mjs
│   │       add_tool_interest_to_tool_date.mjs
│   │       get_company_benefits.mjs
│   │       get_discussions_amount.mjs
│   │       get_linkedin_mentions.mjs
│   │       get_market_offers.mjs
│   │       get_repository_info.mjs
│   │       get_repository_tag.mjs
│   │       make_tools_from_github_explore.mjs
│   │
│   └───tables
│       ├───dimension
│       │       make_community_table.mjs
│       │       make_company_table.mjs
│       │       make_employee_table.mjs
│       │       make_market_table.mjs
│       │       make_project_table.mjs
│       │       make_tool_table.mjs
│       │
│       └───fact
│               make_employee_tool_table.mjs
│               make_project_company_table.mjs
│               make_project_tool_table.mjs
│               make_tool_date_table.mjs
│
├───models
│       create_tables_raw.sql
│       delete_tables_raw.sql
│       fill_artificial_raw.sql
│       print_employees_yoe.mjs
│
└───routes
    │   get_repository_commit_amount.mjs
    │
    └───scrapers
            companiesmarketcap-profile-scraper.mjs
            companiesmarketcap-scraper.mjs
            github-dependencies-scraper.mjs
            github-explore-scraper.mjs
            github-repository-scraper.mjs
            google-trends-scraper.mjs
            linkedin-mentions-scraper.mjs
            names-to-urls-scraper.mjs
            npmjs-scraper.mjs
            scrap-frontend.mjs
            scrap-github-explore.mjs
```
