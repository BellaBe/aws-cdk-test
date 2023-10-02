import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { getHandler } from "./GetSpaces";
import { postHandler } from "./PostSpaces";
import { updateHandler } from "./UpdateSpaces";
import { deleteHandler } from "./DeleteSpaces";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({});


async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {

        switch (event.httpMethod) {
            case "GET":
                return getHandler(event, context, ddbClient);
            case "POST":
                return postHandler(event, context, ddbClient);
            case "PUT":
                return updateHandler(event, context, ddbClient);
            case "DELETE":
                return deleteHandler(event, context, ddbClient);
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: `Unsupported method ${event.httpMethod}`
                    })
                }
        }
    }
    catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal Server Error"
            })
        }
    }
}

export { handler };







