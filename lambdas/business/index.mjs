import pkg from '@aws-sdk/client-dynamodb';

const {DynamoDBClient, PutItemCommand, ScanCommand, UpdateItemCommand, DeleteItemCommand} = pkg;

const client = new DynamoDBClient({region: "eu-north-1"});
const BUSINESS_TABLE = "Businesses";

export const handler = async (event) => {
    const {httpMethod, body} = event;

    switch (httpMethod) {
        case "GET":
            const scanCommand = new ScanCommand({TableName: BUSINESS_TABLE});
            try {
                const result = await client.send(scanCommand);
                const businesses = result.Items.map(item => ({
                    businessId: item.businessId.S,
                    businessName: item.businessName.S,
                    address: item.address.S,
                    phoneNumber: item.phoneNumber.S,
                    websiteUrl: item.websiteUrl.S
                }));
                return {
                    statusCode: 200,
                    body: JSON.stringify(businesses)
                };
            } catch (error) {
                console.error("Error fetching businesses from DynamoDB:", error);
                return {
                    statusCode: 500,
                    body: JSON.stringify({message: "Error fetching businesses from DynamoDB"})
                };
            }

        case "POST":
            const business = JSON.parse(body);
            const putItemCommand = new PutItemCommand({
                TableName: BUSINESS_TABLE,
                Item: {
                    businessId: {S: business.businessId},
                    businessName: {S: business.businessName},
                    address: {S: business.address},
                    phoneNumber: {S: business.phoneNumber},
                    websiteUrl: {S: business.websiteUrl}
                }
            });
            try {
                await client.send(putItemCommand);
                return {
                    statusCode: 200,
                    body: JSON.stringify({message: "BusinessPage added successfully"})
                };
            } catch (error) {
                console.error("Error adding business to DynamoDB:", error);
                return {
                    statusCode: 500,
                    body: JSON.stringify({message: "Error adding business to DynamoDB"})
                };
            }

        case "PUT":
            try {
                const updatedBusiness = JSON.parse(body);

                // Validate input
                if (!updatedBusiness || !updatedBusiness.businessId || !updatedBusiness.businessName || !updatedBusiness.address || !updatedBusiness.phoneNumber || !updatedBusiness.websiteUrl) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ message: "Invalid input. Please provide all required fields." })
                    };
                }

                const updateItemCommand = new UpdateItemCommand({
                    TableName: BUSINESS_TABLE,
                    Key: {
                        "businessId": {S: updatedBusiness.businessId}
                    },
                    UpdateExpression: "set businessName = :businessName, address = :address, phoneNumber = :phoneNumber, websiteUrl = :websiteUrl",
                    ExpressionAttributeValues: {
                        ":businessName": {S: updatedBusiness.businessName},
                        ":address": {S: updatedBusiness.address},
                        ":phoneNumber": {S: updatedBusiness.phoneNumber},
                        ":websiteUrl": {S: updatedBusiness.websiteUrl}
                    }
                });

                await client.send(updateItemCommand);

                return {
                    statusCode: 200,
                    body: JSON.stringify({message: "BusinessPage updated successfully"})
                };

            } catch (error) {
                console.error("Error updating business:", error);

                // Handle specific errors
                if (error.name === "ValidationException") {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({message: "Invalid input or data format.", error})
                    };
                }

                // Generic error response
                return {
                    statusCode: 500,
                    body: JSON.stringify({message: "Internal server error. Please try again later."})
                };
            }

        case "DELETE":
            const { businessId } = JSON.parse(body);
            const deleteItemCommand = new DeleteItemCommand({
                TableName: BUSINESS_TABLE,
                Key: {businessId: {S: businessId}}
            });
            await client.send(deleteItemCommand);
            return {
                statusCode: 200,
                body: JSON.stringify({message: "BusinessPage deleted successfully"})
            };

        default:
            return {
                statusCode: 400,
                body: JSON.stringify({message: "Invalid HTTP method"})
            };
    }
};
