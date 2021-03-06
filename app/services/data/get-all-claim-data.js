const Promise = require('bluebird')
const config = require('../../../knexfile').asyncworker
const knex = require('knex')(config)

module.exports = function (schema, reference, eligibilityId, claimId) {
  return Promise.all([getEligilibility(schema, reference, eligibilityId),
    getPrisoner(schema, reference, eligibilityId),
    getVisitor(schema, reference, eligibilityId),
    getClaim(schema, claimId),
    getClaimChildren(schema, claimId),
    getClaimExpenses(schema, claimId),
    getClaimDocuments(schema, reference, eligibilityId, claimId),
    getClaimBankDetail(schema, claimId),
    getEligibilityVisitorUpdateContactDetail(schema, reference, eligibilityId),
    getClaimEscort(schema, claimId)
  ]).then(function (results) {
    return {
      Eligibility: results[0],
      Prisoner: results[1],
      Visitor: results[2],
      Claim: results[3],
      ClaimChildren: results[4],
      ClaimExpenses: results[5],
      ClaimDocument: results[6],
      ClaimBankDetail: results[7],
      EligibilityVisitorUpdateContactDetail: results[8],
      ClaimEscort: results[9]
    }
  })
}

function getEligilibility (schema, reference, eligibilityId) {
  return knex(`${schema}.Eligibility`).first().where({'Reference': reference, 'EligibilityId': eligibilityId})
}

function getClaim (schema, claimId) {
  return knex(`${schema}.Claim`).first().where({'ClaimId': claimId})
}

function getPrisoner (schema, reference, eligibilityId) {
  return knex(`${schema}.Prisoner`).first().where({'Reference': reference, 'EligibilityId': eligibilityId})
}

function getVisitor (schema, reference, eligibilityId) {
  return knex(`${schema}.Visitor`).first().where({'Reference': reference, 'EligibilityId': eligibilityId})
}

function getClaimExpenses (schema, claimId) {
  return knex(`${schema}.ClaimExpense`).select().where({'ClaimId': claimId, 'IsEnabled': true})
}

function getClaimBankDetail (schema, claimId) {
  return knex(`${schema}.ClaimBankDetail`).first().where('ClaimId', claimId)
}

function getClaimChildren (schema, claimId) {
  return knex(`${schema}.ClaimChild`).select().where({'ClaimId': claimId, 'IsEnabled': true})
}

function getClaimDocuments (schema, reference, eligibilityId, claimId) {
  return knex(`${schema}.ClaimDocument`).select()
    .where({'Reference': reference, 'EligibilityId': eligibilityId, 'ClaimId': claimId, 'IsEnabled': true})
    .orWhere({'Reference': reference, 'EligibilityId': eligibilityId, 'ClaimId': null, 'IsEnabled': true})
}

function getClaimEscort (schema, claimId) {
  return knex(`${schema}.ClaimEscort`).select().where({'ClaimId': claimId, 'IsEnabled': true})
}

function getEligibilityVisitorUpdateContactDetail (schema, reference, eligibilityId) {
  if (schema === 'ExtSchema') {
    return knex(`${schema}.EligibilityVisitorUpdateContactDetail`).first().where({'Reference': reference, 'EligibilityId': eligibilityId}).orderBy('DateSubmitted', 'desc')
  } else {
    return Promise.resolve(null)
  }
}
