import { App } from 'sst/constructs';

import { Links } from './Links';

export const stacks = async (app: App) => {
    app.setDefaultFunctionProps({
        runtime: 'nodejs20.x',
        architecture: 'arm_64',
        nodejs: {
            format: 'esm',
        },
        timeout: 30,
        environment: {
            AWS_ACCOUNT_ID: app.account,
        },
    });

    app.stack(Links, {
        crossRegionReferences,
    });
};
