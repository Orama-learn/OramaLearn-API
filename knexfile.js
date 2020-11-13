require('dotenv').config();
// Update with your config settings.

module.exports = {  
  development:{
    client: 'mysql2',
    connection:{
      host: process.env.HOST_NAME,
      user: process.env.USER_NAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE
    },
    migrations:{
      directory: `${__dirname}/src/database/migrations`
    }
  }
};
