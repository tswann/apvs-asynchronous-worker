const expect = require('chai').expect
const statusEnum = require('../../../../app/constants/status-enum')

const getTaskCountsByStatus = require('../../../../app/services/data/get-task-counts-by-status')

describe('services/data/get-task-counts-by-status', function () {
  it('should return task counts', function (done) {
    getTaskCountsByStatus().then(function (statusCounts) {
      expect(statusCounts[0]).to.contain(statusEnum.PENDING)
      expect(statusCounts[1]).to.contain(statusEnum.INPROGRESS)
      expect(statusCounts[2]).to.contain(statusEnum.COMPLETE)
      expect(statusCounts[3]).to.contain(statusEnum.FAILED)
      done()
    })
  })
})
