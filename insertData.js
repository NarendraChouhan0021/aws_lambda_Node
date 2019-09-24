import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';

const docClient = new AWS.DynamoDB.DocumentClient();

const insertData = async (event, context, callback) => {
    const data = JSON.parse(event.body);
    try {
        const uUid = uuid.v1();

        const params = {
            TableName: 'dev-PlansTable',
            Item: {
                planId: uUid,
                ...data
            }
        };
        await docClient.put(params).promise();

        const getUserparams = {
            TableName: 'dev-PlanUserTable',
            Key: { email: data.email }
        }
        let updatedProject = await docClient.get(getUserparams).promise();

        if ('Item' in updatedProject) {
            let { plans } = updatedProject.Item
            plans.push(uUid)
            getUserparams.UpdateExpression = "set plans = :plans"
            getUserparams.ExpressionAttributeValues = { ':plans': plans }
            getUserparams.ReturnValues = "ALL_NEW"

            await docClient.update(getUserparams).promise();
        } else {
            const userParams = {
                TableName: 'dev-PlanUserTable',
                Item: {
                    email: data.email,
                    plans: [uUid]
                }
            };
            await docClient.put(userParams).promise();
        }

        callback(null, {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify("Succesfully created the record")
        })
    } catch (err) {
        callback(null, { statusCode: 500, body: JSON.stringify(`${err} Couldn't insert data.`) });
    }
};

export default insertData;

