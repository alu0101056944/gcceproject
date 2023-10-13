-- Dimension tables

CREATE TABLE employee(
  employee_id integer PRIMARY KEY,
  title text,
  department text
);

CREATE TABLE tool(
  tool_id integer PRIMARY KEY,
  name text,
  author_company text,
  type text,
  specialization text,
  license text,
  isOpenSource boolean,
  isPeriodicPay boolean,
  downloads integer,
  searches integer,
  easeOfLearning integer
);

CREATE TABLE date(
  date_id integer PRIMARY KEY,
  date date
);

CREATE TABLE community(
  community_id integer PRIMARY KEY,
  name text,
  type text
);

CREATE TABLE company(
  company_id integer PRIMARY KEY,
  name text,
  employee_amount integer,
  amount_of_searches integer,
  type text
);

CREATE TABLE project(
  project_id integer PRIMARY KEY,
  project_name text,
  status text,
  downloads integer,
  contributors integer,
  searches integer
);

 -- Fact tables

CREATE TABLE employee_tool(
  employee_id integer REFERENCES employee (employee_id),
  tool_id integer REFERENCES tool (tool_id),
  years_of_experience integer
);

CREATE TABLE project_tool(
  project_id integer REFERENCES project (project_id),
  tool_id integer REFERENCES tool (tool_id)
);

CREATE TABLE project_company(
  project_id integer REFERENCES project (project_id),
  company_id integer REFERENCES company (company_id),
  budget numeric,
  amount_of_employees_assigned integer
);

CREATE TABLE tool_date(
  tool_id integer REFERENCES tool (tool_id),
  date_id integer REFERENCES date (date_id),
  version text,
  interest_level integer,
  change_type text
);

CREATE TABLE community_tool(
  community_id integer REFERENCES community (community_id),
  tool_id integer REFERENCES tool (tool_id),
  amount_of_bugs_reported integer,
  amount_of_bugs_solved integer,
  amount_of_changes_commited integer,
  amount_of_discussions integer
);

