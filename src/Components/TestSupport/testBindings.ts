import { Table } from 'sst/node/table';

class TestBinding<TResource> {
    #bindings: Partial<TResource> = {};

    public get = (name: keyof TResource): TResource[keyof TResource] | undefined => {
        return this.#bindings[name];
    };

    public set = <TKey extends keyof TResource>(name: TKey, value: TResource[TKey]) => {
        return (this.#bindings[name] = value);
    };

    public clear = () => (this.#bindings = {});
}

export const testBindings = {
    table: new TestBinding<typeof Table>(),
};

export const clearAllTestBindings = () => {
    for (const binding of Object.values(testBindings)) {
        binding.clear();
    }
};

const buildBindingProxy = <TResource>(testBinding: TestBinding<TResource>) =>
    new Proxy(
        {},
        {
            get: (_target, prop) => {
                const bindingValue = testBinding.get(prop as keyof TResource);
                if (bindingValue == null) {
                    throw new Error(`Binding "${String(prop)}" was not set for testing using "testBindings.set()".`);
                }
                return bindingValue;
            },
            set: (_target, prop): boolean => {
                throw new Error(
                    `Binding "${String(prop)}" cannot be set using assignment. Use "testBindings.set()" instead.`
                );
            },
        }
    );

export const testBindingProxies = {
    table: { Table: buildBindingProxy(testBindings.table) },
};
