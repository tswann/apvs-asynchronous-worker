const config = require('../../../knexfile').asyncworker
const knex = require('knex')(config)

module.exports = function (schema, claimExpenseId) {
  return knex(`${schema}.ClaimExpense`).first().where({'ClaimExpenseId': claimExpenseId})
}
