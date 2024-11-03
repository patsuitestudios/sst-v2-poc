import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import schema from 'schemawax';
import { Table } from 'sst/node/table';

export const linkDecoderWithoutLinkId = schema.object({
    required: {
        name: schema.string,
        type: schema.literalUnion('upload', 'download'),
        expirationEpochMs: schema.number,
    },
});

export type LinkWithoutLinkId = schema.Output<typeof linkDecoderWithoutLinkId>;

// TODO: use an intersection or something to derive this from the other one.
export const linkDecoder = schema.object({
    required: {
        linkId: schema.string,
        name: schema.string,
        type: schema.literalUnion('upload', 'download'),
        expirationEpochMs: schema.number,
    },
});

export type Link = schema.Output<typeof linkDecoder>;

const buildKey = (link: Link): Record<string, unknown> => ({
    hk: `link-${link.linkId}`,
    sk: `link-${link.linkId}`,
});

const buildItem = (link: Link): Record<string, unknown> => ({
    ...buildKey(link),
    ...link,
});

const client = () =>
    DynamoDBDocumentClient.from(
        new DynamoDBClient({
            endpoint: Table.LinksTable.endpoint,
        })
    );

const list = async (): Promise<Link[]> => {
    const result = await client().send(
        new ScanCommand({
            TableName: Table.LinksTable.tableName,
        })
    );
    return (
        result.Items?.map((item) => {
            const { sk, hk, ...link } = item;
            return link as Link;
        }) ?? []
    );
};

const put = async (link: Link): Promise<void> => {
    await client().send(
        new PutCommand({
            TableName: Table.LinksTable.tableName,
            Item: buildItem(link),
        })
    );
};

export const linkDataGateway = {
    buildKey,
    list,
    put,
};
