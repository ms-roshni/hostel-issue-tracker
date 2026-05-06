const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Initialize S3 Client
// Make sure AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY are in your .env or environment
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  // If running locally, you need explicit credentials or aws profile configured
  // In lambda, credentials are automatically provided by the IAM role
  // credentials: {
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // }
});

const generateUploadURL = async (fileName, fileType) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `issues/${Date.now()}-${fileName}`,
    ContentType: fileType,
  };

  const command = new PutObjectCommand(params);
  
  // URL expires in 60 seconds
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
  
  // Also return the final public URL if the bucket is public, or access URL
  const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${params.Key}`;
  
  return { uploadUrl, fileUrl };
};

module.exports = { generateUploadURL };
