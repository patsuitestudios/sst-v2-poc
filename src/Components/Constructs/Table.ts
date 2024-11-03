import * as cdk from 'aws-cdk-lib';
import { Table as SstTable } from 'sst/constructs';
import { BindingProps } from 'sst/constructs/util/binding';

const getDynamoEndpoint = (tableArn: string): string => {
    const region = cdk.Fn.select(3, cdk.Fn.split(':', tableArn));
    return cdk.Fn.sub('https://dynamodb.${region}.amazonaws.com', { region });
};

export class Table extends SstTable {
    getBindings(): BindingProps {
        const { clientPackage, permissions, variables } = super.getBindings();
        return {
            clientPackage,
            permissions,
            variables: {
                ...variables,
                endpoint: {
                    type: 'plain',
                    value: getDynamoEndpoint(this.tableArn),
                },
            },
        };
    }
}
