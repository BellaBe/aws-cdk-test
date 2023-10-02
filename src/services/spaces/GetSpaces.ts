import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";


export async function getHandler(event: APIGatewayProxyEvent, context: Context, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult>{
    
    if(event.queryStringParameters){
        if(!event.queryStringParameters.id){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "No id provided"
                })
            }
        }
        const spaceId = event.queryStringParameters.id;
        const params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                id: { S: spaceId }
            }
        }
        const result = await ddbClient.send(new GetItemCommand(params));
        if(!result.Item){
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
                data: unmarshall(result.Item),
                message: "Success"
            })
        }
    } 
        
    const result = await ddbClient.send(new ScanCommand({
        TableName: process.env.TABLE_NAME
    }));
    
    if(!result.Items){
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: "No spaces found"
            })
        }
    }
    
    const spaces = result.Items.map(item => unmarshall(item));
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            data: spaces,
            message: "Success"
        })
    }
}