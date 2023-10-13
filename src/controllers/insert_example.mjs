import pgPromise from 'pg-promise';
const pgp = pgPromise();
const db = pgp({
  connectionString: 'postgres://postgres:foo@localhost:5432/raw_database',
  max: 20
});

// Assuming you have an array of records, each represented as an object
const records = [
  { tool_id: 1, name: 'ansible', author_company: 'Michael Dehaan', type: 'Automation' },
  // ... more records ...
];

// Convert the array of records to a multi-row insert query
const insertQuery = pgp.helpers.insert(records, ['tool_id', 'name', 'author_company', 'type'], 'tool');

// Execute the multi-row insert query
db.none(insertQuery)
 .then(() => {
     console.log('Bulk insert successful');
 })
 .catch(error => {
     console.error('Error:', error);
 });
