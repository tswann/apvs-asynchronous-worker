const config = require('../../../knexfile').asyncworker
const knex = require('knex')(config)

module.exports = function (claimDocumentId) {
  var claimDocMetadata = {
    'ClaimDocumentId': claimDocumentId,
  }

  return knex('IntSchema.ClaimDocumentMetadata').insert(claimDocMetadata)
}