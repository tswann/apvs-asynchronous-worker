const getClaimDocuments = require('../data/get-claim-documents')
const getClaimExpense = require('../data/get-claim-expense')
const insertClaimDocumentMetadata = require('../data/insert-claim-document-metadata')
const analyseImage = require('../cognitive-services/analyse-image')
const serviceEnum = require('../../constants/cognitive-services-enum')
const logger = require('../log')

module.exports.execute = function (task) {
  var claimDocumentId = task.AdditionalData
  return getClaimDocument('IntSchema', claimDocumentId)
    .then(function(claimDocument) {
      if (claimDocument.ClaimExpenseId) {
        var isText = false
        var confidence = 0
        var description
        var matchingExpenseLine
        getClaimExpense(claimDocument.ClaimExpenseId).then(function (claimExpense) {
          analyseImage(claimDocument.Filepath, serviceEnum.ANALYZE).then((analyzeResult) => {
            confidence = analyzeResult.confidence

            if (analyzeResult.isText === true) {
              isText = true
              analyseImage(claimDocument.Filepath, serviceEnum.OCR).then((ocrResult) => {
                var cost = formatCost(claimExpense.Cost)
                _.foreach(ocrResult, function (line) {
                  if (_.some(line, line === cost)) {
                    matchingExpenseLine = line.join(' ')
                  }
                })
              })
            } else {
              description = analyzeResult.description
            }
          }).then(() => {
            insertClaimDocumentMetadata(claimDocumentId, isText, description, matchingExpenseLine, confidence)
          })
        })
      }
    })
}

function formatCost(cost) {
  return parseFloat(Math.round(claimExpense.Cost * 100) / 100).toFixed(2)
}