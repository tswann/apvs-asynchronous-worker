const getClaimDocuments = require('../data/get-claim-documents')
const logger = require('../log')

module.exports.execute = function (task) {
  return getClaimDocuments('IntSchema', task.reference, task.eligibilityId, task.claimId)
    .then(function(documents) {
      return Promise.each(documents, function (document) {
        logger.info(document)
        return document
      })
    })
}
