import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

export async function deleteHandler(event: APIGatewayProxyEvent, context: Context, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult>{
    
    const spaceId = event.queryStringParameters?.id;
    
    
    if(!spaceId){
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "No id provided"
            })
        }
    }
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            id: { S: spaceId }
        }
    }
    await ddbClient.send(new DeleteItemCommand(params));

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Success"
        })
    }
}
