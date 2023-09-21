import {ListTablesCommand, DynamoDBClient, CreateTableCommand} from "@aws-sdk/client-dynamodb";
import {KeySchemaElement, AttributeDefinition} from "@aws-sdk/client-dynamodb/dist-types/models";


export type TableType = {
    TableName: string;
    AttributeDefinitions: AttributeDefinition[];
    KeySchema: KeySchemaElement[];
};


const client = new DynamoDBClient({});

export const list_tables = async () => {
    const command = new ListTablesCommand({});

    const response = await client.send(command);
    console.log(response.TableNames?.join("\n"));
    return response;
};

export const create_table = async (table:TableType) => {
    const command = new CreateTableCommand(table);
    return client.send(command).then(res=> res).catch(e=> e);
};

const table = {
    "AttributeDefinitions": [
        {
            "AttributeName": "Artist",
            "AttributeType": "S"
        },
        {
            "AttributeName": "SongTitle",
            "AttributeType": "S"
        }
    ],
    "KeySchema": [
        {
            "AttributeName": "Artist",
            "KeyType": "HASH"
        },
        {
            "AttributeName": "SongTitle",
            "KeyType": "RANGE"
        }
    ],
    "ProvisionedThroughput": {
        "ReadCapacityUnits": 5,
        "WriteCapacityUnits": 5
    },
    "TableName": "Music"
};

const main = async ()=>{
    console.log("list: ", await list_tables());
    console.log("create: ", await create_table(table));
    console.log("list: ", await list_tables());
}
main();


