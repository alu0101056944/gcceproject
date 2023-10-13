import pgPromise from 'pg-promise';
const pgp = pgPromise();
const db = pgp({
  connectionString: 'postgres://postgres:foo@localhost:5432/raw_database',
  max: 20
});

db
  .none('DELETE FROM tool WHERE tool_id = 1')
  .then(() => {
    return db.none(`INSERT INTO tool(tool_id, name, author_company, type) VALUES
    (1, 'ansible', 'Michael Dehaan', 'Automation')`);
  })
  .then(() => db.query('SELECT * FROM tool'))
  .then(data => {
    console.log('datos: ' + JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error('Error:', error);
  });