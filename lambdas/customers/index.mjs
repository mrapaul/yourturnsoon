
import pkg from '@aws-sdk/client-dynamodb';
const { DynamoDBClient, PutItemCommand, ScanCommand, UpdateItemCommand, DeleteItemCommand } = pkg;

const client = new DynamoDBClient({ region: "eu-north-1" });
const CUSTOMERS_TABLE = "Customers";

export const handler = async (event) => {
    const { httpMethod, body } = event;

    switch (httpMethod) {
        case "GET":
            const scanCommand = new ScanCommand({ TableName: CUSTOMERS_TABLE });
            const customers = await client.send(scanCommand);
            return {
                statusCode: 200,
                body: JSON.stringify(customers.Items)
            };

        case "POST":
            const customer = JSON.parse(body);
            const putItemCommand = new PutItemCommand({
                TableName: CUSTOMERS_TABLE,
                Item: {
                    customerId: { S: customer.id },
                    customerName: { S: customer.name },
                    email: { S: customer.email },
                    phoneNumber: { S: customer.phoneNumber },
                    pushToken: { S: customer.pushToken }
                }
            });
            await client.send(putItemCommand);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Customer added successfully" })
            };

        case "PUT":
            const updatedCustomer = JSON.parse(body);
            const updateItemCommand = new UpdateItemCommand({
                TableName: CUSTOMERS_TABLE,
                Key: { customerId: { S: updatedCustomer.id } },
                UpdateExpression: "set customerName = :name, email = :email, phoneNumber = :phoneNumber, pushToken == :pushToken",
                ExpressionAttributeValues: {
                    ":name": { S: updatedCustomer.name },
                    ":email": { S: updatedCustomer.email },
                    ":phoneNumber": { S: updatedCustomer.phoneNumber },
                    ":pushToken": { S: updatedCustomer.pushToken }
                }
            });
            await client.send(updateItemCommand);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Customer updated successfully" })
            };

        case "DELETE":
            const { customerId } = JSON.parse(body);
            const deleteItemCommand = new DeleteItemCommand({
                TableName: CUSTOMERS_TABLE,
                Key: { customerId: { S: id } }
            });
            await client.send(deleteItemCommand);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Customer deleted successfully" })
            };

        default:
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid HTTP method" })
            };
    }
};
