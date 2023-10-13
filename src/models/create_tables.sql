
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
