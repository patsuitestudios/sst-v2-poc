import { clearAllTestBindings, testBindingProxies } from './src/Components/TestSupport/testBindings';

beforeEach(() => {
    clearAllTestBindings();
});

vi.mock('sst/node/table', () => testBindingProxies.table);
