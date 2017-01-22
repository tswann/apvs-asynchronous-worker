const config = require('../../../knexfile').asyncworker
const knex = require('knex')(config)

module.exports = function (schema, claimDocumentId) {
  return knex(`${schema}.ClaimDocument`)
    .where({'ClaimDocumentId': claimDocumentId })
}
