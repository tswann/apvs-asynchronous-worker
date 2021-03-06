module.exports = function (claimExpenses) {
  if (!claimExpenses || claimExpenses.length === 0) {
    return {}
  }

  var result = { }
  for (var i = 0; i < claimExpenses.length; i++) {
    var claimExpense = claimExpenses[i]
    var list = result[claimExpense.ExpenseType]

    if (list) {
      list.push(claimExpense)
    } else {
      result[claimExpense.ExpenseType] = [claimExpense]
    }
  }

  return result
}
