const { readFileSync } = require("fs");
const { S3 } = require("aws-sdk");

const wasabi = async (filename) => {
  try {
    const ID = process.env.AWS_CLIENT_ID;
    const SECRET = process.env.AWS_CLIENT_SECRET;
    const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
    const wasabiEndpoint = new AWS.Endpoint("s3.wasabisys.com");

    const s3 = new S3({
      endpoint: wasabiEndpoint,
      region: "us-east-2",
      accessKeyId: ID,
      secretAccessKey: SECRET,
    });
    // Read content from the file
    const fileContent = readFileSync(filename);

    // Setting up S3 upload parameters
    const params = {
      Bucket: BUCKET_NAME,
      Key: filename, // File name you want to save as in S3
      Body: fileContent,
      ACL: "public-read",
    };
    var options = { partSize: 10 * 1024 * 1024, queueSize: 1 };
    const data = await s3.putObject(params, options).promise();
    return data;
  } catch (error) {
    console.log("error::s3", error);

    return error || error.message;
  }
};

module.exports = { wasabi };
