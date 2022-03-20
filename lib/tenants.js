const DynamoDB = require('aws-sdk/clients/dynamodb')
const DocumentClient = new DynamoDB.DocumentClient()
const Uuid = require('uuid')

const { TENANTS_TABLE_NAME } = process.env

const createTenant = async () => {
  const tenantId = Uuid.v4()
  const now = new Date().toJSON()

  await DocumentClient.put({
    TableName: TENANTS_TABLE_NAME,
    Item: {
      tenantId,
      createdAt: now,
      lastModified: now,
    }
  }).promise()

  return tenantId
}

module.exports = {
  createTenant
}
