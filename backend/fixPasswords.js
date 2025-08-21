const bcrypt = require('bcrypt');
const { sql, config } = require('./config');

const SALT_ROUNDS = 10;

async function fixMissingPasswords() {
  const pool = await sql.connect(config);

  const result = await pool.request()
    .query("SELECT id, email FROM Users WHERE password IS NULL OR LEN(password) < 20");

  for (const user of result.recordset) {
    const hashedPassword = await bcrypt.hash('default123', SALT_ROUNDS);
    await pool.request()
      .input('id', sql.Int, user.id)
      .input('password', sql.VarChar(255), hashedPassword)
      .query('UPDATE Users SET password=@password WHERE id=@id');
    console.log(`Fixed password for user: ${user.email}`);
  }

  console.log('All missing passwords fixed.');
}

fixMissingPasswords()
  .then(() => process.exit())
  .catch(err => { console.error(err); process.exit(1); });
