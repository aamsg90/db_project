const {Client} = require ('pg')

const client = new Client({
    host: 'localhost',       // Host where PostgreSQL is running
    port: 5432,             // Default PostgreSQL port
    user: 'postgres',       // PostgreSQL user
    password: '080888', // Password for your user
    database: 'banking', // Your database name
  });

  module.exports = client
