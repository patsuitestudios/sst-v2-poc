import { randomUUID } from 'node:crypto';

import { DeleteTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda/trigger/api-gateway-proxy';

import { Link, linkDataGateway } from './linkDataGateway';
import { setupLinksTable } from './linksTableTestSupport';
import { listLinks } from './listLinks';

let linksTableName: string;
let linksTableEndpoint: string;

beforeEach(async () => {
    ({ linksTableName, linksTableEndpoint } = await setupLinksTable());
});

describe('listLinks', () => {
    test('no links', async () => {
        const result = await listLinks();
        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify({ links: [] }),
        });
    });

    test('with links', async () => {
        const links: Link[] = [...new Array(10)].map((_, i) => ({
            linkId: randomUUID(),
            name: `Test Link ${i}`,
            type: 'upload',
            expirationEpochMs: Date.now(),
        }));
        await Promise.all(links.map((link) => linkDataGateway.put(link)));

        const result = await listLinks();
        expect(result).toEqual<APIGatewayProxyStructuredResultV2>({
            statusCode: 200,
            body: expect.any(String),
        });
        const resultBody = JSON.parse(result.body ?? '');
        expect(resultBody).toEqual({ links: expect.toIncludeSameMembers(links) });
    });

    test('error', async () => {
        const client = new DynamoDBClient({ endpoint: linksTableEndpoint });
        await client.send(
            new DeleteTableCommand({
                TableName: linksTableName,
            })
        );

        const result = await listLinks();
        expect(result).toEqual<APIGatewayProxyStructuredResultV2>({
            statusCode: 500,
        });
    });
});
