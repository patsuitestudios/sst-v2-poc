import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        chaiConfig: {
            truncateThreshold: Infinity,
        },
        globals: true,
        globalSetup: 'vitestGlobalSetup.ts',
        mockReset: true,
        setupFiles: ['jest-extended/all', 'vitestSetup.ts'],
        // outputFile: 'junit' // TODO: does github actions UI support this?
        // ui: true,
        // runner: '',
        // reporters: '',
    },
});
