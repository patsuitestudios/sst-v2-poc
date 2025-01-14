/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as cdk from 'aws-cdk-lib';
import { BillingMode, CfnTable, Table as CdkTable } from 'aws-cdk-lib/aws-dynamodb';
import { Table as SstTable } from 'sst/constructs';
import { BindingProps } from 'sst/constructs/util/binding';

const getDynamoEndpoint = (tableArn: string): string => {
    const arnParts = cdk.Fn.split(':', tableArn);
    const region = cdk.Fn.select(3, arnParts);
    return cdk.Fn.sub('https://dynamodb.${region}.amazonaws.com', { region });
};

export class Table extends SstTable {
    get keySchema(): CfnTable.KeySchemaProperty[] {
        // @ts-ignore
        return (this.cdk.table as CdkTable).keySchema;
    }

    get attributeDefinitions(): CfnTable.AttributeDefinitionProperty[] {
        // @ts-ignore
        return (this.cdk.table as CdkTable).attributeDefinitions;
    }

    get billingMode(): BillingMode {
        // @ts-ignore
        return (this.cdk.table as CdkTable).billingMode;
    }

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
