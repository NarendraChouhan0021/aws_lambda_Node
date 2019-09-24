import * as AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();

const getUserPlans = async (event, context, callback) => {
    let email = decodeURI(event.pathParameters.email);

    try {
        const getUserparams = {
            TableName: 'dev-PlanUserTable',
            Key: { email: email }
        }
        let updatedProject = await docClient.get(getUserparams).promise();

        if ('Item' in updatedProject) {
            let { plans } = updatedProject.Item

            let keySetArray = plans.map(id => { return { 'planId': id } })
            let queryParams = { RequestItems: {} };

            queryParams.RequestItems['dev-PlansTable'] = { Keys: keySetArray };

            let plansResultId = await docClient.batchGet(queryParams).promise();

            if ('dev-PlansTable' in plansResultId.Responses) {
                callback(null, {
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                    },
                    body: JSON.stringify(plansResultId.Responses['dev-PlansTable'])
                });
            } else {
                callback(null, { statusCode: 500, body: JSON.stringify(`no plams found for this user`) });
            }
        } else {
            callback(null, { statusCode: 500, body: JSON.stringify(`no record found for this user`) });
        }
    } catch (err) {
        callback(null, { statusCode: 500, body: JSON.stringify(`${err} Couldn't insert data.`) });
    }
};

export default getUserPlans;

