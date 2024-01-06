/**
 * @author Marcos Barrios
 * @since 23_10_2023
 * @desc Build a time table
 */

'use strict';

import { readFileSync, writeFileSync } from 'fs';

import pgPromise from 'pg-promise';

export default function addDateEntry() {

  const pgp = pgPromise();
  const db = pgp({
    connectionString: 'postgres://postgres:foo@localhost:5432/raw_database',
    max: 20
  });

  try {
    const PERSISTENT_OBJECT_CONTENT =
        readFileSync('./src/persistent_ids.json', 'utf-8');
    const idsInfo = JSON.parse(PERSISTENT_OBJECT_CONTENT);
    idsInfo.date++;
    try {
      writeFileSync('./src/persistent_ids.json', JSON.stringify(idsInfo, null, 2));
    } catch (err) {
      console.error('Error reading persistent object at build table date ' +
          err);
    }
    const record = {
      date_id: idsInfo.date,
      date: new Date(),
    };
    const insertQuery = pgp.helpers.insert(record, ['date_id', 'date'], 'date');
    db.none(insertQuery)
      .then(() => {
        console.log('Insert into date successful.');
      })
      .catch(error => {
        console.error('Error inserting into date: ', error);
      });
  } catch (err) {
    console.err('Error reading persistent object at build table date' +
        err);
  }
}
