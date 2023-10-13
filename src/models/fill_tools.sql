
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

