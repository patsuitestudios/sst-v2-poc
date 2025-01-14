import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda/trigger/api-gateway-proxy';

import { linkDataGateway } from '../linkDataGateway';

export const listLinks = async (): Promise<APIGatewayProxyStructuredResultV2> => {
    try {
        const links = await linkDataGateway.list();
        return {
            statusCode: 200,
            body: JSON.stringify({ links }),
        };
    } catch (err) {
        console.error('Failed to list links', err);
        return {
            statusCode: 500,
        };
    }
};

export const handler: APIGatewayProxyHandlerV2 = listLinks;
