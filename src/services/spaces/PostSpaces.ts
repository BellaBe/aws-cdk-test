import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { env } from "process";
import { v4 } from "uuid";
import { MissingFieldError, validatedAsSpaceEntry } from "../shaared/Validator";



export async function postHandler(event: APIGatewayProxyEvent, context: Context, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    const randomId = v4();
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "No body provided"
            })
        }
    }
    const body = JSON.parse(event.body);

    const { location, description, name, photoUrl } = body;

    const item = {
        id: randomId,
        location,
        description,
        name,
        photoUrl,
        createdAt: new Date().toISOString()
    }

    validatedAsSpaceEntry(item);

    const params = {
        TableName: env.TABLE_NAME,
        Item: marshall(item)
    }

    try {
        const result = await ddbClient.send(new PutItemCommand(params));

        return {
            statusCode: 201,
            body: JSON.stringify({
                id: randomId,
            })
        }
    } catch (err) {
        if(err instanceof MissingFieldError){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: err.message
                })
            }
        }
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal Server Error"
            })
        }
    }
}
