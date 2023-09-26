This demo project is about interacting with dynamodb using Node.js SDK

Please reference this [official tutorial page](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.CreateTable.html) for more features. 

## Set up the environment

- Step 1, clone this project to your local machine and within the project root folder 
  install dependencies
  ```bash
  npm i
  ```
- Step 2, set up the commandline credential for access your aws services.
    
- Step 3, the testing code is under dynamodb/{index.ts, client.ts}, where
  - index.ts contains the functions for creating/inserting/querying/scanning 
  dynamodb table
  - the client.ts contains a main function which you can use to call the 
  functions in index.ts for testing.
  - To run the client.ts use the following command:
    ```bash
    npx ts-node dynamodb/client.ts # on windows cmd you may use "\" in the path 
    ```
### Interacting with dynamodb table 

1. list tables
2. create table
3. insert item
4. scan table
5. query table
6. delete item

### (Optional if interested) Interaction from Front-end

1. run nextjs dev
```bash
npm run dev
```
