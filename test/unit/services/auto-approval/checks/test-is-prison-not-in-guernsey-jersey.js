const expect = require('chai').expect
const guernseyJerseyPrisonsEnum = require('../../../../../app/constants/guernsey-jersey-prisons-enum')
const isPrisonNotInGuernseyJersey = require('../../../../../app/services/auto-approval/checks/is-prison-not-in-guernsey-jersey')

var validAutoApprovalData = {
  Prisoner: {
    NameOfPrison: 'hewell'
  }
}

var invalidAutoApprovalData = {
  Prisoner: {
    NameOfPrison: guernseyJerseyPrisonsEnum.LES_NICOLLES.value
  }
}

describe('services/auto-approval/checks/is-prison-not-in-guernsey-jersey', function () {
  it('should return true if the prison is outside Guernsey/Jersey', function () {
    var check = isPrisonNotInGuernseyJersey(validAutoApprovalData)
    expect(check.result).to.equal(true)
  })

  it('should return false if the prison is in Guernsey/Jersey', function () {
    var check = isPrisonNotInGuernseyJersey(invalidAutoApprovalData)
    expect(check.result).to.equal(false)
  })
})
