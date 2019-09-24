import * as AWS from 'aws-sdk';
import { createResponseObject, createErrorResponseObject, getUsersDetails, getItem, getItems } from "../../utils/utils";
const docClient = new AWS.DynamoDB();

const createTables = async (event, context, callback) => {
  
    try {
        var params = {
            TableName: "dev-PlanUserTable",
            KeySchema: [
                { AttributeName: "email", KeyType: "HASH" }, //Partition key
            ],
            AttributeDefinitions: [
                { AttributeName: "email", AttributeType: "S" },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        };
        docClient.createTable(params, function (err, data) {
            if (err) {
                console.error(
                    "Unable to create table. Error JSON:",
                    JSON.stringify(err, null, 2)
                );
            } else {
                console.log(
                    "Created table. Table description JSON:",
                    JSON.stringify(data, null, 2)
                );
            }
        });

        console.log("called starting second table")

        var params2 = {
            TableName: "dev-PlansTable",
            KeySchema: [
                { AttributeName: "planId", KeyType: "HASH" }, //Partition key
            ],
            AttributeDefinitions: [
                { AttributeName: "planId", AttributeType: "S" },
                { AttributeName: "email", AttributeType: "S" }
            ],
            GlobalSecondaryIndexes: [
                {
                    IndexName: 'email-Index',
                    KeySchema: [
                        {
                            AttributeName: 'email',
                            KeyType: "HASH"
                        },
                    ],
                    Projection: {
                        ProjectionType: "ALL"
                    },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 10,
                        WriteCapacityUnits: 10
                    }
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        };
        docClient.createTable(params2, function (err, data) {
            if (err) {
                console.error(
                    "Unable to create table. Error JSON:",
                    JSON.stringify(err, null, 2)
                );
            } else {
                console.log(
                    "Created table. Table description JSON:",
                    JSON.stringify(data, null, 2)
                );
            }
        });
        callback(null, createResponseObject([]));
    } catch (err) {
        callback(null, createErrorResponseObject(err, `Couldn't get videos.`));
    }
};

export default createTables;
