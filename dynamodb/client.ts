import {create_table, list_tables, scan_table} from "./index";

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
        // console.log("create: ", await create_table(table));
        // console.log("list: ", await insert_tables());
    // const item = {TableName: 'Music',Item:  {Artist: "Jay", SongTitle: "Hei Ha"}}
    // console.log("insert: ", await write_to_table(item));
    // console.log('aaa', await scan_table(table.TableName))


}
main();
