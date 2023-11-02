import pkg from '@aws-sdk/client-s3';
const { S3 } = pkg;


const s3Client = new S3({ region: 'eu-north-1' });
const S3_BUCKET_NAME = 'yts-qr-dev';

export const handler = async (event) => {
    switch (event.httpMethod) {
        case 'GET':
            return await getQRCodeUrl(event.queryStringParameters.fileName);
        case 'POST':
            return await uploadQRCodeToS3(event.body);
        default:
            return {
                statusCode: 405,
                body: JSON.stringify({ message: 'HTTP method not supported' }),
            };
    }
};

const generateFileName = () => {
    const timestamp = new Date().toISOString();
    const randomNum = Math.floor(Math.random() * 1000);
    return `qrCode_${timestamp}_${randomNum}.png`;
};

const uploadQRCodeToS3 = async (qrCodeData) => {
    const fileName = generateFileName();
    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: qrCodeData,
        ContentType: 'image/png',
        ACL: 'public-read'
    };

    try {
        await s3Client.putObject(params);
        const qrCodeUrl = `https://${params.Bucket}.s3.${s3Client.config.region}.amazonaws.com/${params.Key}`;
        return {
            statusCode: 200,
            body: JSON.stringify({ qrCodeUrl }),
        };
    } catch (error) {
        console.error('Error uploading QR code to S3:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};

// Add this function to index.mjs

const getQRCodeUrl = async (fileName) => {
    if (!fileName) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'File name is required' }),
        };
    }

    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName
    };

    try {
        // Check if the object exists in the bucket
        await s3Client.headObject(params);
        const qrCodeUrl = `https://${params.Bucket}.s3.${s3Client.config.region}.amazonaws.com/${params.Key}`;
        return {
            statusCode: 200,
            body: JSON.stringify({ qrCodeUrl }),
        };
    } catch (error) {
        console.error('Error fetching QR code URL from S3:', error);
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'QR code not found' }),
        };
    }
};

