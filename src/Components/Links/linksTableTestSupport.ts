import { randomUUID } from 'node:crypto';

import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { inject } from 'vitest';

import { testBindings } from '../TestSupport/testBindings';

export const setupLinksTable = async (): Promise<{ linksTableName: string; linksTableEndpoint: string }> => {
    const linksTableName = `links-${randomUUID()}`;
    const linksTableEndpoint = inject('dockerDynamoEndpoint');

    const client = new DynamoDBClient({ endpoint: linksTableEndpoint });
    await client.send(
        new CreateTableCommand({
            TableName: linksTableName,
            AttributeDefinitions: [
                { AttributeName: 'hk', AttributeType: 'S' },
                { AttributeName: 'sk', AttributeType: 'S' },
            ],
            KeySchema: [
                { AttributeName: 'hk', KeyType: 'HASH' },
                { AttributeName: 'sk', KeyType: 'RANGE' },
            ],
            BillingMode: 'PAY_PER_REQUEST' as const,
        })
    );

    testBindings.table.set('LinksTable', {
        endpoint: linksTableEndpoint,
        tableName: linksTableName,
    });

    return {
        linksTableName,
        linksTableEndpoint,
    };
};
