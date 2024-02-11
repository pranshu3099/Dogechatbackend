const mysql = require("mysql");
const database_connection_limit = process.env.DATABASE_CONNECTION_LIMIT;
const database_host = process.env.DATABASE_HOST;
const database_user_name = process.env.DATABASE_USER_NAME;
const database_password = process.env.DATABASE_PASSWORD;
const database_name = process.env.DATABASE_NAME;
const pool = mysql.createPool({
  connectionLimit: database_connection_limit,
  host: database_host,
  user: database_user_name,
  password: database_password,
  database: database_name,
});
module.exports = pool;
