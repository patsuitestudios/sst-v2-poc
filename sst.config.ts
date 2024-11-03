import { SSTConfig } from 'sst';

import { stacks } from './src/Applications';

export default {
    config: () => ({
        name: 'sst-v2-poc',
        region: 'us-east-1',
    }),
    stacks,
} satisfies SSTConfig;
