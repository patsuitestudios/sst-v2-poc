import { ApiGatewayV1Api, Config, Function, StackContext } from 'sst/constructs';

import { Table } from '../Components/Constructs/Table';

export function Links({ stack }: StackContext) {
    const linksTable = new Table(stack, 'LinksTable', {
        fields: {
            hk: 'string',
            sk: 'string',
        },
        primaryIndex: {
            partitionKey: 'hk',
            sortKey: 'sk',
        },
    });

    const listLinksHandler = new Function(stack, 'ListLinksHandler', {
        handler: 'src/Components/Links/listLinks.handler',
        bind: [linksTable],
    });

    const linksApi = new ApiGatewayV1Api(stack, 'LinksApi', {
        routes: {
            'GET /': { function: listLinksHandler },
        },
    });

    return { linksTable };
}
