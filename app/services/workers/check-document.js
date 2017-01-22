const getClaimDocument = require('../data/get-claim-document')
const getClaimExpense = require('../data/get-claim-expense')
const insertClaimDocumentMetadata = require('../data/insert-claim-document-metadata')
const analyseImage = require('../cognitive-services/analyse-image')
const serviceEnum = require('../../constants/cognitive-services-enum')
const logger = require('../log')

module.exports.execute = function (task) {
  var claimDocumentId = task.additionalData
  const TARGET_SCHEMA = 'IntSchema'
  return getClaimDocument(TARGET_SCHEMA, claimDocumentId)
    .then(function(claimDocument) {
      if (claimDocument.DocumentType === 'RECEIPT') {
        var isText = false
        var confidence = 0
        var description
        var matchingExpenseLine
        getClaimExpense(TARGET_SCHEMA, claimDocument.ClaimExpenseId).then(function (claimExpense) {
          analyseImage(claimDocument.Filepath, serviceEnum.ANALYZE).then((analyzeResult) => {
            confidence = analyzeResult.confidence
            logger.info('Successful ANALYZE')
            logger.info('Description: ' + analyzeResult.description)

            if (analyzeResult.isText === true) {
              isText = true
              analyseImage(claimDocument.Filepath, serviceEnum.OCR).then((ocrResult) => {
                var cost = formatCost(claimExpense.Cost)
                logger.info('Is Text, OCR Called')
                logger.info('Comparing cost: ' + cost)
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