import * as AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();

const createTables = async (event, context, callback) => {
    const data = JSON.parse(event.body);

    try {
        const getUserparams = {
            TableName: 'dev-PlansTable',
            IndexName: 'email-Index',
            FilterExpression: "planId = :planId AND email = :email",
            ExpressionAttributeValues: { ":planId": data.planId, ":email": data.email }
        }
        let plans_data = await docClient.scan(getUserparams).promise();
        plans_data = plans_data.Items[0]
        console.log("updatedProject", plans_data.dates)
        if (plans_data.dates.hasOwnProperty(data.dates)) {
            let obj = {}
            obj[data.dates] = { "reading": ["123456789"], "complete": true }
            const obj2 = obj
            const obj3 = { ...plans_data.dates, ...obj2 }

            let projectSearchParams2 = {
                TableName: 'dev-PlansTable',
                Key: { planId: data.planId },
                UpdateExpression: 'SET dates = :dates',
                ExpressionAttributeValues: {
                    ':dates': obj3,
                },
                ReturnValues: "UPDATED_NEW"
            };
            let projects2 = await docClient.update(projectSearchParams2).promise();
            console.log("projects2...............", projects2)
        }

        callback(null, { statusCode: 200, body: JSON.stringify([]) });
    } catch (err) {
        callback(null, { statusCode: 500, body: JSON.stringify(`${err} Couldn't insert data.`) });
    }
};

export default createTables;

