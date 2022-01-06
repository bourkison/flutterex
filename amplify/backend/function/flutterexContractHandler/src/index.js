const aws = require('aws-sdk');
const MongooseModels = require("/opt/nodejs/models");
let MONGODB_URI;

const createContract = async (event) => {
    let contractForm = JSON.parse(event.body).contractForm;
    // const User = await MongooseModels().User(MONGODB_URI);
    const Contract = await MongooseModels().Contract(MONGODB_URI);

    let response = {
        statusCode: 500,
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ success: false })
    };

    try {
        const contract = new Contract(contractForm)
        const contractResult = contract.save();

        if (!contractResult) {
            throw new Error("No contract result");
        }

        response.statusCode = 200;
        response.body = JSON.stringify({ success: true, data: contractResult });
    }
    catch (err) {
        response.body = JSON.stringify({
            success: false,
            message: "Error creating contract",
            error: err
        })
    }
    finally {
        return response;
    }
}

exports.handler = async (event, context) => {
    /* By default, the callback waits until the runtime event loop is empty before freezing the process and returning the results to the caller. Setting this property to false requests that AWS Lambda freeze the process soon after the callback is invoked, even if there are events in the event loop. AWS Lambda will freeze the process, any state data, and the events in the event loop. Any remaining events in the event loop are processed when the Lambda function is next invoked, if AWS Lambda chooses to use the frozen process. */
    context.callbackWaitsForEmptyEventLoop = false;
    let response;

    const { Parameters } = await new aws.SSM()
        .getParameters({
            Names: ["MONGODB_URI"].map(secretName => process.env[secretName]),
            WithDecryption: true
        })
        .promise();

    MONGODB_URI = Parameters[0].Value;

    switch (event.httpMethod) {
        case "POST":
            response = await createContract(event);
            break;
        default:
            response = {
                statusCode: 500,
                body: JSON.stringify({
                    success: false,
                    message: "Method does not exist"
                })
            }
            break;
    }

    return response;
};
