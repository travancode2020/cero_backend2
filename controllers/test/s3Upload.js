const { readFileSync } = require("fs");
const AWS = require("aws-sdk");

const wasabi = async (filename) => {
  try {
    const ID = "B1ZCNMWG7K0DS9MGBGZ9";
    const SECRET = "EuoFt8hyRAE11dfpeSNOZVIfe80IotNvgqqBzlJr";
    const BUCKET_NAME = "upload234";
    const wasabiEndpoint = new AWS.Endpoint("s3.wasabisys.com");

    const s3 = new AWS.S3({
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
    console.log(params);

    var options = { partSize: 10 * 1024 * 1024, queueSize: 1 };
    const data = await s3.upload(params, options).promise();
    return data;
  } catch (error) {
    console.log("error::s3", error);

    return error || error.message;
  }
};

module.exports = { wasabi };
