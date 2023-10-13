
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

INSERT INTO company(company_id, name, employee_amount, amount_of_searches)
  VALUES (1, 'gcce', 20, 28732);


INSERT INTO tool (
    tool_id,
    name,
    author_company,
    type,
    specialization,
    license,
    isOpenSource,
    isPeriodicPay,
    downloads,
    searches,
    easeOfLearning
) VALUES
    (1, 'JavaScript', 'Various', 'Programming Language', 'Web Development', 'MIT', true, false, 1000000, 50000, 4),
    (2, 'Ansible', 'Red Hat', 'Automation Tool', 'Infrastructure Automation', 'GPLv3', true, false, 150000, 10000, 3),
    (3, 'Git', 'Various', 'Version Control System', 'Software Development', 'GPL', true, false, 5000000, 200000, 5),
    (4, 'GitHub', 'GitHub, Inc.', 'Version Control System', 'Software Development', 'Proprietary', true, true, 20000000, 1000000, 3),
    (5, 'Sass', 'Various', 'CSS Preprocessor', 'Web Development', 'MIT', true, false, 50000, 5000, 3),
    (6, 'Ruby', 'Various', 'Programming Language', 'Web Development', 'Ruby License', true, false, 100000, 10000, 2),
    (7, 'React.js', 'Facebook', 'JavaScript Library', 'Front-end Development', 'MIT', true, false, 5000000, 300000, 4),
    (8, 'PostgreSQL', 'PostgreSQL Global Development Group', 'Database Management System', 'Database', 'PostgreSQL License', true, false, 2000000, 100000, 4);


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

