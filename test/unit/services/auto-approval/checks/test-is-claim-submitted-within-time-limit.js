const expect = require('chai').expect
const dateFormatter = require('../../../../../app/services/date-formatter')
const isClaimSubmittedWithinTimeLimit = require('../../../../../app/services/auto-approval/checks/is-claim-submitted-within-time-limit')

const validAutoApprovalData = {
  Claim: {
    ClaimId: 1,
    DateSubmitted: dateFormatter.now().subtract(2, 'days').toDate(),
    DateOfJourney: dateFormatter.now().subtract(30, 'days').toDate()
  },
  maxDaysAfterAPVUVisit: '28'
}

const invalidAutoApprovalData = {
  Claim: {
    ClaimId: 2,
    DateSubmitted: dateFormatter.now().subtract(1, 'days').toDate(),
    DateOfJourney: dateFormatter.now().subtract(30, 'days').toDate()
  },
  maxDaysAfterAPVUVisit: '28'
}

describe('services/auto-approval/checks/is-claim-submitted-within-time-limit', function () {
  it('should return true if the submission date is less than or equal to 28 days after the visit date', function () {
    var checkResult = isClaimSubmittedWithinTimeLimit(validAutoApprovalData)
    expect(checkResult.result).to.equal(true)
  })

  it('should return true if claim total is less than the max claim total', function () {
    var checkResult = isClaimSubmittedWithinTimeLimit(invalidAutoApprovalData)
    expect(checkResult.result).to.equal(false)
  })
})
