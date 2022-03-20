const Cognito = require('aws-sdk/clients/cognitoidentityserviceprovider')
const CognitoClient = new Cognito()
const DynamoDB = require('aws-sdk/clients/dynamodb')
const DocumentClient = new DynamoDB.DocumentClient()
const Uuid = require('uuid')

const { USER_POOL_ID, USERS_TABLE_NAME } = process.env

const createUser = async (firstName, lastName, email, tenantId) => {
  const now = new Date().toJSON()

  const createResp = await CognitoClient.adminCreateUser({
    UserPoolId: USER_POOL_ID,
    Username: email,
    UserAttributes: [{
      Name: 'given_name',
      Value: firstName
    }, {
      Name: 'family_name',
      Value: lastName
    }, {
      Name: 'email',
      Value: email
    }, {
      Name: 'custom:tenant_id',
      Value: tenantId
    }],
    TemporaryPassword: Uuid.v4()
  }).promise()

  const userId = createResp.User.Username

  await DocumentClient.put({
    TableName: USERS_TABLE_NAME,
    Item: {
      tenantId,
      userId,
      email,
      firstName,
      lastName,
      createdAt: now,
      lastModified: now,
    }
  }).promise()

  return createResp.User.Username
}

const addUserToGroup = async (username, group) => {
  await CognitoClient.adminAddUserToGroup({
    UserPoolId: USER_POOL_ID,
    Username: username,
    GroupName: group
  }).promise()
}

module.exports = {
  createUser,
  addUserToGroup,
}
