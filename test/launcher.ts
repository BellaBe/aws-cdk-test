import { handler } from "../src/services/spaces/handler";
import "dotenv/config"

process.env = {
    TABLE_NAME: process.env.TABLE_NAME,
    AWS_REGION: process.env.AWS_REGION
} as any;

handler({
    httpMethod: "POST",
    body: JSON.stringify({
        location: "test location",
        description: "test description"
    })
} as any, {} as any).then(console.log).catch(console.error);