
 -- Dimension tables

DROP TABLE employee CASCADE;
DROP TABLE tool CASCADE;
DROP TABLE date CASCADE;
DROP TABLE community CASCADE;
DROP TABLE company CASCADE;
DROP TABLE project CASCADE;
DROP TABLE market CASCADE;

 -- Fact tables

DROP TABLE employee_tool;
DROP TABLE project_tool;
DROP TABLE project_company;
DROP TABLE tool_date;
DROP TABLE community_tool;
DROP TABLE tool_project_company;
DROP TABLE community_tool_date;
DROP TABLE company_date;
DROP TABLE market_date;
DROP TABLE market_tool_date;

