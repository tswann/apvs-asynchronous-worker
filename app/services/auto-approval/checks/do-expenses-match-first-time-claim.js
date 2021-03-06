const groupExpensesByType = require('../../notify/helpers/group-expenses-by-type')
const AutoApprovalCheckResult = require('../../domain/auto-approval-check-result')

const CHECK_NAME = 'do-expenses-match-first-time-claim'
const FAILURE_MESSAGE = 'The number or type of expenses for this claim don\'t match the last manually approved claim'

module.exports = function (autoApprovalData) {
  if (autoApprovalData.latestManuallyApprovedClaim && autoApprovalData.latestManuallyApprovedClaim.claimExpenses) {
    var groupedFirstTimeClaimExpenses = groupExpensesByType(autoApprovalData.latestManuallyApprovedClaim.claimExpenses)
    var groupedCurrentExpenses = groupExpensesByType(autoApprovalData.ClaimExpenses)

    for (var i = 0; i < Object.keys(groupedCurrentExpenses).length; i++) {
      var index = Object.keys(groupedCurrentExpenses)[i]
      var currentExpenseTypeGroup = groupedCurrentExpenses[index]

      // For each expense type, check that the first time claim contains the same expense type
      // with the same or less number of claim expenses
      if (!groupedFirstTimeClaimExpenses[index] || currentExpenseTypeGroup.length > groupedFirstTimeClaimExpenses[index].length) {
        return new AutoApprovalCheckResult(CHECK_NAME, false, FAILURE_MESSAGE)
      }
    }
  }

  return new AutoApprovalCheckResult(CHECK_NAME, true, '')
}
