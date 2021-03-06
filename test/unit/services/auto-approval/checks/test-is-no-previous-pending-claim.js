const expect = require('chai').expect
const statusEnum = require('../../../../../app/constants/status-enum')
const isNoPreviousPendingClaim = require('../../../../../app/services/auto-approval/checks/is-no-previous-pending-claim')

var previousClaimsWithPending = {
  previousClaims: [
    {
      ClaimId: 798118115,
      Status: statusEnum.PENDING
    },
    {
      ClaimId: 798118116,
      Status: statusEnum.SUBMITTED
    }
  ]
}

var previousClaimsNotPending = {
  previousClaims: [
    {
      ClaimId: 798118117,
      Status: statusEnum.SUBMITTED
    },
    {
      ClaimId: 798118118,
      Status: statusEnum.INPROGRESS
    }
  ]
}

var noPreviousClaims = {
  previousClaims: []
}

describe('services/auto-approval/checks/is-no-previous-pending-claim', function () {
  it('should return false if there is a previous pending claim', function () {
    var check = isNoPreviousPendingClaim(previousClaimsWithPending)
    expect(check.result).to.equal(false)
  })

  it('should return true if there is no previous pending claims', function () {
    var check = isNoPreviousPendingClaim(previousClaimsNotPending)
    expect(check.result).to.equal(true)
  })

  it('should return true if there is no previous claims', function () {
    var check = isNoPreviousPendingClaim(noPreviousClaims)
    expect(check.result).to.equal(true)
  })
})
