const config = require('../../../config')
const sendNotification = require('../notify/send-notification')

module.exports.execute = function (task) {
  var reference = task.reference
  var requestInfoUrl = `${config.EXTERNAL_SERVICE_URL}${config.EXTERNAL_PATH_ALREADY_REGISTERED}`
  var personalisation = {reference: reference, requestInfoUrl: requestInfoUrl}

  var emailAddress = task.additionalData
  var emailTemplateId = config.NOTIFY_REQUEST_INFORMATION_CLAIM_EMAIL_TEMPLATE_ID

  return sendNotification(emailTemplateId, emailAddress, personalisation)
}
