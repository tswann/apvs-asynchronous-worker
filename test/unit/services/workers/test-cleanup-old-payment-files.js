const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const OLD_PAYMENT_FILES = [{
  PaymentFileId: '1',
  FileType: 'TEST',
  DateCreated: '2016-11-29T17:03:29.746Z',
  Filepath: 'filepath/test.csv',
  IsEnabled: 'true'
}]

const deleteOldPaymentFiles = sinon.stub().resolves()
const getOldPaymentFiles = sinon.stub().resolves(OLD_PAYMENT_FILES)
const updateOldPaymentFilesIsEnabledFalse = sinon.stub().resolves()

const cleanupOldPaymentFiles = proxyquire('../../../../app/services/workers/cleanup-old-payment-files', {
  '../direct-payments/delete-old-payment-files': deleteOldPaymentFiles,
  '../data/get-old-payment-files': getOldPaymentFiles,
  '../data/update-old-payment-files-is-enabled-false': updateOldPaymentFilesIsEnabledFalse
})

describe('services/workers/cleanup-old-payment-files', function () {
  it('should get old payment files, delete them, and update their IsEnabled status', function () {
    return cleanupOldPaymentFiles.execute({}).then(function () {
      expect(deleteOldPaymentFiles.calledWith(OLD_PAYMENT_FILES)).to.be.true
      expect(getOldPaymentFiles.calledOnce).to.be.true
      expect(updateOldPaymentFilesIsEnabledFalse.calledWith(OLD_PAYMENT_FILES[0].PaymentFileId))
    })
  })
})
