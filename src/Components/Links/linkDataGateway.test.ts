import { randomUUID } from 'node:crypto';

import { Link, linkDataGateway } from './linkDataGateway';
import { setupLinksTable } from './linksTableTestSupport';

beforeEach(async () => {
    await setupLinksTable();
});

describe('linkDataGateway', () => {
    test('no links', async () => {
        const links = await linkDataGateway.list();
        expect(links).toEqual([]);
    });

    test('put & list', async () => {
        const link: Link = {
            linkId: randomUUID(),
            name: 'Test Link',
            type: 'download',
            expirationEpochMs: Date.now() + 1_000 * 60 * 60,
        };

        await linkDataGateway.put(link);

        const links = await linkDataGateway.list();
        expect(links).toEqual([link]);
    });
});
