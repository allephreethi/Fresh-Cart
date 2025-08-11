// backend/dbConfig.js
const sql = require('mssql');

const config = {
  user: 'sa',
  password: '123456',
  server: 'DESKTOP-E238M55\\SQLEXPRESS',
  database: 'FreshCart',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};

module.exports = { sql, config };
