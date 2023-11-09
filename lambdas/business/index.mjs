/* eslint-disable no-case-declarations */
import pkg from "@aws-sdk/client-dynamodb";
import crypto from "crypto";

const {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} = pkg;

const client = new DynamoDBClient({ region: "eu-north-1" });
const BUSINESS_TABLE = "Businesses";

const generatePassword = (length = 8) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

export const handler = async (event) => {
  const { httpMethod, body, queryStringParameters } = event;

  switch (httpMethod) {
    case "GET":
      if (queryStringParameters && queryStringParameters.email && queryStringParameters.password) {
        const emailToCheck = queryStringParameters.email;
        const passwordToCheck = queryStringParameters.password;
        const scanCommand = new ScanCommand({
          TableName: BUSINESS_TABLE,
          FilterExpression: "email = :emailVal and password = :passwordVal",
          ExpressionAttributeValues: {
            ":emailVal": { S: emailToCheck },
            ":passwordVal": { S: passwordToCheck },
          },
        });
        try {
          const result = await client.send(scanCommand);
          if (result.Items && result.Items.length > 0) {
            // Business found, sign-in successful
            return {
              headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Credentials": true, 
              },
              statusCode: 200,
              body: JSON.stringify({ signInSuccess: true }),
            };
          } else {
            // Business not found, sign-in failed
            return {
              headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Credentials": true, 
              },
              statusCode: 401,
              body: JSON.stringify({ signInSuccess: false }),
            };
          }
        } catch (error) {
          console.error("Error during sign-in:", error);
          return {
            headers: {
              "Access-Control-Allow-Origin": "*", 
              "Access-Control-Allow-Credentials": true, 
            },
            statusCode: 500,
            body: JSON.stringify({
              message: "Error during sign-in",
            }),
          };
        }
      }
      // If an email is provided in the query parameters, check if it exists
      if (queryStringParameters && queryStringParameters.email) {
        const emailToCheck = queryStringParameters.email;
        const scanCommand = new ScanCommand({
          TableName: BUSINESS_TABLE,
          FilterExpression: "email = :emailVal",
          ExpressionAttributeValues: {
            ":emailVal": { S: emailToCheck },
          },
        });
        try {
          const result = await client.send(scanCommand);
          if (result.Items && result.Items.length > 0) {
            return {
              headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Credentials": true, 
              },
              statusCode: 200,
              body: JSON.stringify({ exists: true }),
            };
          } else {
            return {
              headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Credentials": true, 
              },
              statusCode: 200,
              body: JSON.stringify({ exists: false }),
            };
          }
        } catch (error) {
          console.error("Error checking email from DynamoDB:", error);
          return {
            headers: {
              "Access-Control-Allow-Origin": "*", 
              "Access-Control-Allow-Credentials": true, 
            },
            statusCode: 500,
            body: JSON.stringify({
              message: "Error checking email from DynamoDB",
            }),
          };
        }
      }
      const scanCommand = new ScanCommand({ TableName: BUSINESS_TABLE });
      try {
        const result = await client.send(scanCommand);
        const businesses = result.Items.map((item) => ({
          businessId: item.businessId.S,
          businessName: item.businessName.S,
          address: item.address.S,
          phoneNumber: item.phoneNumber.S,
          websiteUrl: item.websiteUrl.S,
        }));
        return {
          headers: {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Credentials": true, 
          },
          statusCode: 200,
          body: JSON.stringify(businesses),
        };
      } catch (error) {
        console.error("Error fetching businesses from DynamoDB:", error);
        return {
          headers: {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Credentials": true, 
          },
          statusCode: 500,
          body: JSON.stringify({
            message: "Error fetching businesses from DynamoDB",
          }),
        };
      }

    case "POST":
      const business = JSON.parse(body);

      // Validate required fields
      if (
        !business.email ||
        !business.businessName ||
        !business.address ||
        !business.phoneNumber
      ) {
        return {
          headers: {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Credentials": true, 
          },
          statusCode: 400,
          body: JSON.stringify({
            message:
              "All fields are required: email, businessName, address, phoneNumber",
          }),
        };
      }

      // Generate a password for the business
      const password = generatePassword();

      const putItemCommand = new PutItemCommand({
        TableName: BUSINESS_TABLE,
        Item: {
          email: { S: business.email },
          businessName: { S: business.businessName },
          address: { S: business.address },
          phoneNumber: { S: business.phoneNumber },
          websiteUrl: { S: business.websiteUrl || "" }, // Optional field
          password: { S: password }, // Storing the password
        },
      });

      try {
        await client.send(putItemCommand);
        return {
          headers: {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Credentials": true, 
          },
          statusCode: 200,
          body: JSON.stringify({
            message: "Business added successfully",
            password: password,
          }), // Returning the generated password
        };
      } catch (error) {
        console.error("Error adding business to DynamoDB:", error);
        return {
          headers: {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Credentials": true, 
          },
          statusCode: 500,
          body: JSON.stringify({
            message: "Error adding business to DynamoDB",
          }),
        };
      }

    case "PUT":
      try {
        const updatedBusiness = JSON.parse(body);

        // Validate input
        if (
          !updatedBusiness ||
          !updatedBusiness.businessId ||
          !updatedBusiness.businessName ||
          !updatedBusiness.address ||
          !updatedBusiness.phoneNumber ||
          !updatedBusiness.websiteUrl
        ) {
          return {
            headers: {
              "Access-Control-Allow-Origin": "*", 
              "Access-Control-Allow-Credentials": true, 
            },
            statusCode: 400,
            body: JSON.stringify({
              message: "Invalid input. Please provide all required fields.",
            }),
          };
        }

        const updateItemCommand = new UpdateItemCommand({
          TableName: BUSINESS_TABLE,
          Key: {
            businessId: { S: updatedBusiness.businessId },
          },
          UpdateExpression:
            "set businessName = :businessName, address = :address, phoneNumber = :phoneNumber, websiteUrl = :websiteUrl",
          ExpressionAttributeValues: {
            ":businessName": { S: updatedBusiness.businessName },
            ":address": { S: updatedBusiness.address },
            ":phoneNumber": { S: updatedBusiness.phoneNumber },
            ":websiteUrl": { S: updatedBusiness.websiteUrl },
          },
        });

        await client.send(updateItemCommand);

        return {
          headers: {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Credentials": true, 
          },
          statusCode: 200,
          body: JSON.stringify({
            message: "BusinessPage updated successfully",
          }),
        };
      } catch (error) {
        console.error("Error updating business:", error);

        // Handle specific errors
        if (error.name === "ValidationException") {
          return {
            headers: {
              "Access-Control-Allow-Origin": "*", 
              "Access-Control-Allow-Credentials": true, 
            },
            statusCode: 400,
            body: JSON.stringify({
              message: "Invalid input or data format.",
              error,
            }),
          };
        }

        // Generic error response
        return {
          headers: {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Credentials": true, 
          },
          statusCode: 500,
          body: JSON.stringify({
            message: "Internal server error. Please try again later.",
          }),
        };
      }

    case "DELETE":
      const { businessId } = JSON.parse(body);
      const deleteItemCommand = new DeleteItemCommand({
        TableName: BUSINESS_TABLE,
        Key: { businessId: { S: businessId } },
      });
      await client.send(deleteItemCommand);
      return {
        headers: {
          "Access-Control-Allow-Origin": "*", 
          "Access-Control-Allow-Credentials": true, 
        },
        statusCode: 200,
        body: JSON.stringify({ message: "BusinessPage deleted successfully" }),
      };

    default:
      return {
        headers: {
          "Access-Control-Allow-Origin": "*", 
          "Access-Control-Allow-Credentials": true, 
        },
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid HTTP method" }),
      };
  }
};
