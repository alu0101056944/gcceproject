-- Dimension tables

CREATE TABLE employee(
  employee_id integer,
  name text,
  title text,
  department text
);

CREATE TABLE tool(
  tool_id integer,
  name text,
  author_company text,
  type text,
  specialization text,
  version integer,
  date_from timestamp
);

CREATE TABLE date(
  date_id integer,
  date timestamp
);

CREATE TABLE community(
  community_id integer,
  name text,
  type text
);

CREATE TABLE company(
  company_id integer,
  name text,
  employee_amount integer,
  amount_of_searches integer,
  type text
);

CREATE TABLE project(
  project_id integer,
  project_name text,
  downloads integer,
  contributors integer,
  searches integer
);

CREATE TABLE market(
  market_id integer
);

 -- Fact tables

CREATE TABLE employee_tool(
  employee_id integer,
  tool_id integer,
  years_of_experience integer
);

CREATE TABLE project_tool(
  project_id integer,
  tool_id integer
);

CREATE TABLE project_company(
  project_id integer,
  company_id integer,
  budget numeric,
  amount_of_employees_assigned integer
);

CREATE TABLE tool_date(
  tool_id integer,
  date_id integer,
  version text,
  interest_level integer,
  change_type text
);

CREATE TABLE community_tool(
  community_id integer,
  tool_id integer,
  amount_of_bugs_reported integer,
  amount_of_bugs_solved integer,
  amount_of_changes_commited integer,
  amount_of_discussions integer
);

CREATE TABLE tool_project_company(
  tool_id integer,
  project_id integer,
  company_id integer
);

CREATE TABLE community_tool_date(
  community_id integer,
  tool_id integer,
  date_id integer,
  tool_score integer,
  rank integer
);

CREATE TABLE company_date( -- to use date_from on orchestration
  company_id integer,
  benefit numeric
);

CREATE TABLE market_date( -- not orchestrated in apache hop
  market_id integer,
  date_id integer,
  total_amount_of_offers integer
);

CREATE TABLE market_tool_date(
  market_id integer,
  tool_id integer,
  date_id integer,
  amount_of_mentions integer
);
