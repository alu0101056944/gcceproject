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
)

CREATE TABLE project_tool(
  project_id integer REFERENCES project (project_id),
  tool_id integer REFERENCES tool (tool_id)
)
