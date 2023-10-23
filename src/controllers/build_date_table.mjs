/**
 * @author Marcos Barrios
 * @since 23_10_2023
 * @desc Build a time table
 */

'use strict';

import pgPromise from 'pg-promise';
const pgp = pgPromise();
const db = pgp({
  connectionString: 'postgres://postgres:foo@localhost:5432/raw_database',
  max: 20
});

// Create a record with the Date object
const record = {
  tool_id: 1,
  name: 'ansible',
  author_company: 'Michael Dehaan',
  type: 'Automation',
  your_date_column: dateObject,
};

// Use pg-promise's helpers to insert the record
const insertQuery = pgp.helpers.insert(record, ['tool_id', 'name', 'author_company', 'type', 'your_date_column'], 'your_table');

// Execute the insert query
db.none(insertQuery)
  .then(() => {
    console.log('Insert successful');
  })
  .catch(error => {
    console.error('Error:', error);
  });

export default function addDateEntry() {

}
