const _ = require('lodash')
const getClaimDocument = require('../data/get-claim-document')
const getClaimExpense = require('../data/get-claim-expense')
const insertClaimDocumentMetadata = require('../data/insert-claim-document-metadata')
const analyseImage = require('../cognitive-services/analyse-image')
const serviceEnum = require('../../constants/cognitive-services-enum')

module.exports.execute = function (task) {
  var claimDocumentId = task.additionalData
  const TARGET_SCHEMA = 'IntSchema'
  return getClaimDocument(TARGET_SCHEMA, claimDocumentId)
    .then(function (claimDocument) {
      if (claimDocument.DocumentType === 'RECEIPT') {
        var isText = false
        var confidence = 0.0
        var description = ''
        var matchingExpenseLine = ''
        getClaimExpense(TARGET_SCHEMA, claimDocument.ClaimExpenseId).then((claimExpense) => {
          var cost = formatCost(claimExpense.Cost)
          analyseImage(claimDocument.Filepath, serviceEnum.ANALYZE).then((analyzeResult) => {
            description = analyzeResult.description
            confidence = analyzeResult.confidence
            if (analyzeResult.isText === true) {
              isText = true
              analyseImage(claimDocument.Filepath, serviceEnum.OCR).then((ocrResult) => {
                _.forEach(ocrResult, function (line) {
                  if (_.some(line, function (token) { return token === cost })) {
                    matchingExpenseLine = line.join(' ')
                  }
                })
              }).then(() => {
                insertClaimDocumentMetadata(claimDocumentId, isText, description, matchingExpenseLine, confidence)
                  .catch((error) => console.log(error))
              })
            }
          })
        })
      }
    })
}

function formatCost (cost) {
  return parseFloat(Math.round(cost * 100) / 100).toFixed(2)
}
