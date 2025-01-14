import { ApiGatewayV1Api, Function, StackContext } from 'sst/constructs';

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
        handler: 'src/Components/Links/apiRoutes/listLinks.handler',
        bind: [linksTable],
    });

    const createLinkHandler = new Function(stack, 'CreateLinkHandler', {
        handler: 'src/Components/Links/apiRoutes/createLink.handler',
        bind: [linksTable],
    });

    const linksApi = new ApiGatewayV1Api(stack, 'LinksApi', {
        routes: {
            'GET /': { function: listLinksHandler },
            'POST /': { function: createLinkHandler },
        },
    });

    return { linksTable, linksApi };
}
