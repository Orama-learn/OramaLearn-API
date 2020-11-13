const knexfile = require('../../knexfile');
const knex = require('knex')(knexfile.development);
// Update with your config settings.
module.exports = knex;