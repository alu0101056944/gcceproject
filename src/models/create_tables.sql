
CREATE TABLE tool(
  tool_id numeric PRIMARY KEY,
  name text,
  author_company text,
  type text,
  specialization text,
  license text,
  isOpenSource boolean,
  isPeriodicPay boolean,
  downloads numeric,
  searches numeric,
  easeOfLearning numeric
);


