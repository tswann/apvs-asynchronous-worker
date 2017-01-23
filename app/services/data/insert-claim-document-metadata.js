const config = require('../../../knexfile').asyncworker
const knex = require('knex')(config)

module.exports = function (claimDocumentId, isText, description, matchingExpenseLine, confidence) {
  var claimDocMetadata = {
    'ClaimDocumentId': claimDocumentId,
    'IsText': isText,
    'Description': description,
    'MatchingExpenseLine': matchingExpenseLine,
    'Confidence': confidence
  }

  return knex('IntSchema.ClaimDocumentMetadata').insert(claimDocMetadata)
}
