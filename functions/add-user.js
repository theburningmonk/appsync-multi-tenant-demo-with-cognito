const { createUser, addUserToGroup } = require('../lib/users')

module.exports.handler = async (event) => {
  const { firstName, lastName, email } = event.arguments.input
  const tenantId = event.identity.claims['custom:tenant_id']

  const username = await createUser(firstName, lastName, email, tenantId)
  await addUserToGroup(username, 'User')

  return true
}
