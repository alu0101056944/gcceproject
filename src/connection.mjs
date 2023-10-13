import pgPromise from 'pg-promise';
const pgp = pgPromise();
const db = pgp('postgres://postgres:foo@localhost:5432/raw_database');

db.query('SELECT * FROM tool')
  .then(data => {
    console.log('datos: ' + data);
  })
  .catch(error => {
    console.error('Error:', error);
  });