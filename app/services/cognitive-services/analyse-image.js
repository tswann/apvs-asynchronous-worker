const config = require('../../../config')
const request = require('request-promise')
const logger = require('../log')
const fs = require('fs')
const serviceTypes = require('../../../constants/cognitive-services-enum')

module.exports = function (path, service) {
  var options = getRequestOptions(path, service)
  logger.info(options.uri)
  return request(options)
    .then((response) => {
      logger.debug(response)

      if (service === serviceTypes.ANALYZE) {
        handleAnalzeResult(response)
      } else {
        handleOcrResult(response)
      }

      return response
    })
    .catch((error) => {
      logger.error(error)
    })
}

function handleAnalyzeResult(response) {
  logger.info('TODO - Update Claim with results of image analysis')
}

function handleOcrResult(response) {
  logger.info('TODO - Update Claim with results of OCR')
}

function getRequestOptions (path, service) {
  const analyzeParams = 'visualFeatures=Description&language=en'
  const ocrParams = 'language=en&detectOrientation=true'
  const params = (service === serviceTypes.ANALYZE) ? analyzeParams : ocrParams
  return {
    uri: `${config.VISION_API_URL}${service}?${params}`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Ocp-Apim-Subscription-Key': config.VISION_API_SUBSCRIPTION_KEY
    },
    formData: getFormData(path),
    json: true
  }
}

function getFormData(path) {
  return {
    file: fs.createReadStream(path)
  }
}
