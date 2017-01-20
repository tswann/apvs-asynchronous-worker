const config = require('../../../config')
const request = require('request-promise')
const logger = require('../log')
const fs = require('fs')

module.exports = function (path) {
  var options = getDefaultOptions(path)
  logger.info(options.uri)
  return request(options)
    .then((response) => {
      logger.debug(response)
      return response
    })
    .catch((error) => {
      logger.error(error)
    })
}

function getDefaultOptions (path) {
  return {
    uri: `${config.VISION_API_URL}analyze?visualFeatures=Description&language=en`,
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
