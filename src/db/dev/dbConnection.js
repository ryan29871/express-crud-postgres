import pool from './pool';

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Create Goal Table
 */
const createGoalTable = () => {
  const goalCreateQuery = `CREATE TABLE IF NOT EXISTS goals
  (id SERIAL PRIMARY KEY, 
  title TEXT UNIQUE NOT NULL, 
  description TEXT, 
  complete BOOLEAN`;

  pool.query(goalCreateQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};


/**
 * Drop Goal Table
 */
const dropGoalTable = () => {
  const goalsDropQuery = 'DROP TABLE IF EXISTS goals';
  pool.query(goalsDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};


/**
 * Create All Tables
 */
const createAllTables = () => {
  createGoalTable();
};


/**
 * Drop All Tables
 */
const dropAllTables = () => {
  dropGoalTable();
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});


export {
  createAllTables,
  dropAllTables,
};

require('make-runnable');