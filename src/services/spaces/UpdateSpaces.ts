import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient, UpdateItemCommand, UpdateItemInput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function updateHandler(event: APIGatewayProxyEvent, context: Context, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    if (event.queryStringParameters && ("id" in event.queryStringParameters) && event.body) {
        const spaceId = event.queryStringParameters.id;
        const body = JSON.parse(event.body);
        const params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                id: { S: spaceId }
            },
            UpdateExpression: "set #description = :description, #location = :location",
            ExpressionAttributeValues: {
                ":description": { S: body.description },
                ":location": { S: body.location }
            },
            ExpressionAttributeNames: {
                "#description": "description",
                "#location": "location"
            },
            ReturnValues: "ALL_NEW"
            
        } as UpdateItemInput
        const result = await ddbClient.send(new UpdateItemCommand(params));
        if (!result.Attributes) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: "Space not found"
                })
            }
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                data: unmarshall(result.Attributes),
                message: "Success"
            })
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            message: "Please provide right a"
        })
    }
}