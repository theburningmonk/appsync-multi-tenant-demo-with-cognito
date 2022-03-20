const { createUser, addUserToGroup } = require('../lib/users')
const { createTenant } = require('../lib/tenants')

module.exports.handler = async (event) => {
  const { firstName, lastName, email } = event.arguments.input

  const tenantId = await createTenant()
  const username = await createUser(firstName, lastName, email, tenantId)
  await addUserToGroup(username, 'Admin')

  return true
}
