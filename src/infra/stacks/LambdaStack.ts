import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

import { join } from 'path';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

interface LambdaStackProps extends StackProps {
    spaceTable: ITable;
}

export class LambdaStack extends Stack {
    public readonly spacesLambdaIntegration: LambdaIntegration;
    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);
        const spacesLambda = new NodejsFunction(this, 'SpacesLambda', {
            entry: join(__dirname, '..', '..', 'services', "spaces", "handler.ts"),
            handler: 'handler',
            runtime: Runtime.NODEJS_LATEST,
            environment: {
                TABLE_NAME: props.spaceTable.tableName
            }
        });
        
        spacesLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['dynamodb:PutItem', 'dynamodb:Scan', 'dynamodb:GetItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
            resources: [props.spaceTable.tableArn]
            })
        );

        this.spacesLambdaIntegration = new LambdaIntegration(spacesLambda);
    }
}