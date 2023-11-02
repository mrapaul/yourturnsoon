import pkg from '@aws-sdk/client-dynamodb';
const { DynamoDBClient, PutItemCommand, ScanCommand, UpdateItemCommand, DeleteItemCommand } = pkg;

const client = new DynamoDBClient({ region: "eu-north-1" });
const QUEUES_TABLE = "Queues";

export const handler = async (event) => {
    const { httpMethod, body } = event;

    switch (httpMethod) {
        case "GET":
            const scanCommand = new ScanCommand({ TableName: QUEUES_TABLE });
            const queues = await client.send(scanCommand);
            return {
                statusCode: 200,
                body: JSON.stringify(queues.Items)
            };

        case "POST":
            const queue = JSON.parse(body);
            const putItemCommand = new PutItemCommand({
                TableName: QUEUES_TABLE,
                Item: {
                    queueId: { S: queue.id },
                    queueName: { S: queue.name },
                    status: { S: queue.status },
                    capacity: { S: queue.capacity }
                }
            });
            await client.send(putItemCommand);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Queue added successfully" })
            };

        case "PUT":
            const updatedQueue = JSON.parse(body);
            const updateItemCommand = new UpdateItemCommand({
                TableName: QUEUES_TABLE,
                Key: { queueId: { S: updatedQueue.id } },
                UpdateExpression: "set queueName = :name, status = :status, capacity = :capacity",
                ExpressionAttributeValues: {
                    ":queueName": { S: updatedQueue.name },
                    ":status": { S: updatedQueue.status },
                    ":capacity": { S: updatedQueue.capacity }
                }
            });
            await client.send(updateItemCommand);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Queue updated successfully" })
            };

        case "DELETE":
            const { id } = JSON.parse(body);
            const deleteItemCommand = new DeleteItemCommand({
                TableName: QUEUES_TABLE,
                Key: { queueId: { S: id } }
            });
            await client.send(deleteItemCommand);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Queue deleted successfully" })
            };

        default:
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid HTTP method" })
            };
    }
};

