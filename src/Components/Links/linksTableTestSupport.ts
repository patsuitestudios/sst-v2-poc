import { randomUUID } from 'node:crypto';

import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Template } from 'aws-cdk-lib/assertions';
import { App, getStack } from 'sst/constructs';
import { initProject } from 'sst/project';
import { inject } from 'vitest';
import { it } from 'vitest';

import { Links } from '../../Applications/Links';
import { Table } from '../Constructs/Table';
import { testBindings } from '../TestSupport/testBindings';

export const setupLinksTable = async (): Promise<{ linksTableName: string; linksTableEndpoint: string }> => {
    await initProject({});
    const app = new App({ mode: 'deploy' });
    // Create the Database stack
    app.stack(Links);

    // Wait for resources to finalize
    await app.finish();

    // Get the CloudFormation template of the stack
    const stack = getStack(Links);
    const linksTableNode = stack.node.findChild('LinksTable');
    expect(linksTableNode).instanceOf(Table);
    const linksTable = linksTableNode as Table;

    const linksTableName = `links-${randomUUID()}`;
    const dockerDynamoEndpoint = inject('dockerDynamoEndpoint');

    const client = new DynamoDBClient({ endpoint: dockerDynamoEndpoint });

    await client.send(
        new CreateTableCommand({
            TableName: linksTableName,
            AttributeDefinitions: linksTable.attributeDefinitions,
            KeySchema: linksTable.keySchema,
            BillingMode: linksTable.billingMode,
        })
    );

    testBindings.table.set('LinksTable', {
        endpoint: dockerDynamoEndpoint,
        tableName: linksTableName,
    });

    return {
        linksTableName,
        linksTableEndpoint: dockerDynamoEndpoint,
    };
};
