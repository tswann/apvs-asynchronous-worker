const _ = require('lodash')
const config = require('../../../config')
const request = require('request-promise')
const logger = require('../log')
const fs = require('fs')
const serviceTypes = require('../../../app/constants/cognitive-services-enum')

const tags = {
  TEXT_TAG: "text"
}

module.exports = function (path, service) {
  var options = getRequestOptions(path, service)
  logger.info(options.uri)
  return request(options)
    .then((response) => {
      logger.debug(response)

      if (service === serviceTypes.ANALYZE) {
        return handleAnalyzeResult(response)
      } else {
        return handleOcrResult(response)
      }

      return response
    })
    .catch((error) => {
      logger.error(error)
    })
}
/**
 * @param  {Object} response - Raw response from Vision API Analyze endpoint
 * @returns {Object} parsedResponse - summary of image contents
 * @returns {boolean} parsedResponse.isText - indicate if image is text
 * @returns {string} parsedResponse.description - human readable description
 * @returns {Number} parsedResponse.confidence - Confidence value for prediction [0 - 1]
 */
function handleAnalyzeResult(response) {
  var description = response.description
  var text
  var confidence
  var isText = false
  if (description.captions[0]) {
    text = description.captions[0].text
    confidence = description.captions[0].confidence
    isText = _.some(description.tags, (tag) => {
      return tag === tags.TEXT_TAG
    })
  }

  return { isText: isText, description: text, confidence: confidence}
}

/**
 * @param  {Object} response - Raw response from Vision API OCR endpoint
 * @returns {Array} parsedLines - 2D array of all lines within the image
 */
function handleOcrResult(response) {
  var lines = []
  if (response.regions) {
    lines = _.map(response.regions, parseRegion)
  }

  // I don't care about preserving regions, so flatten this
  // out into 2D if the result is a 3D array
  if (lines[0] && lines[0][0] && lines[0][0].length > 1) {
    lines = lines.reduce(function(prev, curr) {
      return prev.concat(curr)
    })
  }

  return lines
}

function parseRegion(region) {
  return _.map(region.lines, function(line) {
    return _.map(line.words, function(word) {
      return word.text
    })
  })
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
