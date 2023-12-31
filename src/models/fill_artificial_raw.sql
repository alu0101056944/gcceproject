
INSERT INTO employee(employee_id, name, title, department)
  VALUES
    (1, 'John Smith', 'Software Engineer', 'IT'),
    (2, 'Sarah Johnson', 'Software Engineer', 'IT'),
    (3, 'Michael Williams', 'Software Engineer', 'IT'),
    (4, 'Emily Davis', 'Software Engineer', 'IT'),
    (5, 'David Anderson', 'Software Engineer', 'IT'),
    (6, 'Jennifer Brown', 'Software Engineer', 'IT'),
    (7, 'Jessica Taylor', 'Software Engineer', 'IT'),
    (8, 'Robert Martin', 'Software Engineer', 'IT'),
    (9, 'Susan Harris', 'Software Engineer', 'IT'),
    (10, 'Christopher Lee', 'Software Engineer', 'IT'),
    (11, 'Mary White', 'Software Engineer', 'IT'),
    (12, 'Daniel Turner', 'Software Engineer', 'IT'),
    (13, 'Karen Martinez', 'Software Engineer', 'IT'),
    (14, 'William Clark', 'Software Engineer', 'IT'),
    (15, 'Lisa Young', 'Software Engineer', 'IT'),
    (16, 'Joseph Rodriguez', 'Software Engineer', 'IT'),
    (17, 'Patricia Hall', 'Software Engineer', 'IT'),
    (18, 'Richard Jackson', 'Software Engineer', 'IT'),
    (19, 'Linda Lewis', 'Software Engineer', 'IT'),
    (20, 'Thomas Moore', 'Software Engineer', 'IT');

INSERT INTO tool (
    tool_id,
    name,
    author_company,
    type,
    specialization,
) VALUES
    (1, 'JavaScript', 'Various', 'Programming Language', 'Web Development'),
    (2, 'Ansible', 'Red Hat', 'Automation Tool', 'Infrastructure Automation'),
    (3, 'Git', 'Various', 'Version Control System', 'Software Development'),
    (4, 'GitHub', 'GitHub, Inc.', 'Version Control System', 'Software Development'),
    (5, 'Sass', 'Various', 'CSS Preprocessor', 'Web Development'),
    (6, 'Ruby', 'Various', 'Programming Language', 'Web Development'),
    (7, 'React.js', 'Facebook', 'JavaScript Library', 'Front-end Development'),
    (8, 'PostgreSQL', 'PostgreSQL Global Development Group', 'Database Management System', 'Database');


INSERT INTO employee_tool(employee_id, tool_id, years_of_experience)
  VALUES
    (1, 1, 7),
    (1, 2, 8),
    (1, 3, 3),
    (1, 4, 4),
    (1, 5, 9),
    (1, 6, 3),
    (1, 7, 2),
    (1, 8, 3),
    (2, 1, 8),
    (2, 2, 7),
    (2, 3, 2),
    (2, 4, 8),
    (2, 5, 5),
    (2, 6, 9),
    (2, 7, 2),
    (2, 8, 5),
    (3, 1, 1),
    (3, 2, 2),
    (3, 3, 7),
    (3, 4, 8),
    (3, 5, 1),
    (3, 6, 7),
    (3, 7, 9),
    (3, 8, 4),
    (4, 1, 3),
    (4, 2, 6),
    (4, 3, 9),
    (4, 4, 3),
    (4, 5, 7),
    (4, 6, 3),
    (4, 7, 6),
    (4, 8, 3),
    (5, 1, 9),
    (5, 2, 3),
    (5, 3, 3),
    (5, 4, 9),
    (5, 5, 6),
    (5, 6, 9),
    (5, 7, 4),
    (5, 8, 4),
    (6, 1, 1),
    (6, 2, 7),
    (6, 3, 9),
    (6, 4, 2),
    (6, 5, 6),
    (6, 6, 3),
    (6, 7, 9),
    (6, 8, 9),
    (7, 1, 6),
    (7, 2, 4),
    (7, 3, 5),
    (7, 4, 4),
    (7, 5, 8),
    (7, 6, 8),
    (7, 7, 1),
    (7, 8, 7),
    (8, 1, 9),
    (8, 2, 9),
    (8, 3, 8),
    (8, 4, 7),
    (8, 5, 5),
    (8, 6, 4),
    (8, 7, 3),
    (8, 8, 5),
    (9, 1, 8),
    (9, 2, 3),
    (9, 3, 2),
    (9, 4, 2),
    (9, 5, 8),
    (9, 6, 3),
    (9, 7, 7),
    (9, 8, 1),
    (10, 1, 8),
    (10, 2, 8),
    (10, 3, 5),
    (10, 4, 8),
    (10, 5, 8),
    (10, 6, 9),
    (10, 7, 1),
    (10, 8, 8),
    (11, 1, 9),
    (11, 2, 5),
    (11, 3, 7),
    (11, 4, 2),
    (11, 5, 1),
    (11, 6, 4),
    (11, 7, 7),
    (11, 8, 1),
    (12, 1, 5),
    (12, 2, 2),
    (12, 3, 1),
    (12, 4, 7),
    (12, 5, 7),
    (12, 6, 3),
    (12, 7, 7),
    (12, 8, 6),
    (13, 1, 3),
    (13, 2, 9),
    (13, 3, 1),
    (13, 4, 6),
    (13, 5, 2),
    (13, 6, 5),
    (13, 7, 6),
    (13, 8, 8),
    (14, 1, 7),
    (14, 2, 2),
    (14, 3, 1),
    (14, 4, 8),
    (14, 5, 2),
    (14, 6, 2),
    (14, 7, 3),
    (14, 8, 9),
    (15, 1, 3),
    (15, 2, 1),
    (15, 3, 3),
    (15, 4, 6),
    (15, 5, 1),
    (15, 6, 3),
    (15, 7, 1),
    (15, 8, 5),
    (16, 1, 4),
    (16, 2, 7),
    (16, 3, 8),
    (16, 4, 5),
    (16, 5, 8),
    (16, 6, 2),
    (16, 7, 9),
    (16, 8, 8),
    (17, 1, 6),
    (17, 2, 6),
    (17, 3, 8),
    (17, 4, 6),
    (17, 5, 7),
    (17, 6, 7),
    (17, 7, 3),
    (17, 8, 5),
    (18, 1, 4),
    (18, 2, 5),
    (18, 3, 9),
    (18, 4, 8),
    (18, 5, 9),
    (18, 6, 1),
    (18, 7, 3),
    (18, 8, 7),
    (19, 1, 5),
    (19, 2, 9),
    (19, 3, 4),
    (19, 4, 7),
    (19, 5, 1),
    (19, 6, 2),
    (19, 7, 8),
    (19, 8, 1),
    (20, 1, 1),
    (20, 2, 5),
    (20, 3, 1),
    (20, 4, 8),
    (20, 5, 3),
    (20, 6, 5),
    (20, 7, 5),
    (20, 8, 4);

INSERT INTO date(date_id, date)
  VALUES
    (1, '2023-10-21'),
    (2, '2023-10-22'),
    (3, '2023-10-23');

INSERT INTO community(community_id, name, type)
  VALUES
    (1, 'github', 'hosting');
    (2, 'stackoverflow', 'forum');

INSERT INTO company(company_id, name, employee_amount, amount_of_searches, type)
  VALUES
    (1, 'Various', 5000, 1000000, 'Diverse Company'),
    (2, 'Red Hat', 12000, 2500000, 'Software Company'),
    (3, 'GitHub, Inc.', 1500, 300000, 'Software Development Company'),
    (4, 'Facebook', 40000, 5000000, 'Social Media Company'),
    (5, 'PostgreSQL Global Development Group', 50, 50000, 'Open Source Organization');

INSERT INTO project (project_id, project_name, status, downloads, contributors, searches)
  VALUES
    (1, 'JavaScript', 'Active', 10000000, 5000, 2000000),
    (2, 'Ansible', 'Active', 500000, 2000, 100000),
    (3, 'Git', 'Active', 80000000, 3000, 3000000),
    (4, 'GitHub', 'Active', 150000000, 10000, 5000000),
    (5, 'Sass', 'Active', 3000000, 1000, 200000),
    (6, 'Ruby', 'Active', 700000, 300, 10000),
    (7, 'React.js', 'Active', 2500000, 5000, 800000),
    (8, 'PostgreSQL', 'Active', 5000000, 2000, 300000);

INSERT INTO market (market_id)
  VALUES
    (1),
    (2),
    (3);

INSERT INTO project_tool (project_id, tool_id)
  VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5);

INSERT INTO project_company (project_id, company_id, budget, amount_of_employees_assigned)
  VALUES
    (1, 1, 500000, 10),
    (1, 2, 300000, 5),
    (2, 3, 750000, 15),
    (3, 4, 400000, 8),
    (4, 2, 1000000, 20);

INSERT INTO tool_date (tool_id, date_id, version, interest_level, change_type)
  VALUES
    (1, 1, '1.0.0', 90, 'Major Update'),
    (2, 2, '2.3.1', 80, 'Bug Fix'),
    (3, 3, '3.1.0', 95, 'Feature Release'),
    (4, 1, '2.0.0', 85, 'Major Update'),
    (5, 2, '1.1.0', 75, 'Minor Update');

INSERT INTO community_tool (
  community_id,
  tool_id,
  amount_of_bugs_reported,
  amount_of_bugs_solved,
  amount_of_changes_commited,
  amount_of_discussions)
  VALUES
    (1, 1, 150, 120, 200, 50),
    (1, 2, 80, 70, 120, 30),
    (2, 3, 200, 180, 250, 60),
    (3, 4, 100, 90, 150, 40),
    (4, 5, 120, 100, 170, 45);

INSERT INTO tool_project_company (tool_id, project_id, company_id)
  VALUES
    (1, 1, 1),
    (2, 2, 2),
    (3, 3, 3),
    (4, 4, 4),
    (5, 5, 5);

INSERT INTO community_tool_date (community_id, tool_id, date_id, tool_score, rank)
  VALUES
    (1, 1, 1, 90, 1),
    (1, 2, 2, 85, 2),
    (2, 3, 3, 92, 1),
    (3, 4, 4, 88, 1),
    (4, 5, 5, 89, 1);

INSERT INTO company_date (company_id, year, quarter, benefit)
  VALUES
    (1, 2023, 1, 1200000.00),
    (1, 2023, 2, 1100000.00),
    (2, 2023, 1, 950000.00),
    (3, 2023, 1, 1300000.00),
    (4, 2023, 2, 1050000.00);

INSERT INTO market_date (market_id, date_id, total_amount_of_offers)
  VALUES
    (1, 1, 1500),
    (1, 2, 1200),
    (2, 3, 2200),
    (3, 4, 1800),
    (4, 5, 2500);

INSERT INTO market_tool_date (market_id, tool_id, date_id, amount_of_mentions)
  VALUES
    (1, 1, 1, 80),
    (1, 2, 2, 70),
    (2, 3, 3, 90),
    (3, 4, 4, 85),
    (4, 5, 5, 100);

