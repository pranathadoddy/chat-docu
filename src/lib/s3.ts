import AWS from 'aws-sdk';

export async function uploadFileToS3(file: File) {
  AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region: process.env.NEXT_PUBLIC_AWS_REGION,
  });

  try {
    const s3 = new AWS.S3({
      params: { Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME },
      region: 'ap-shoutheast-1',
    });

    const file_key =
      'uploads/' + Date.now().toString() + file.name.replace(' ', '-');

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: file_key,
      Body: file,
      ContentType: file.type,
    };

    const upload = s3
      .putObject(params)
      .on('httpUploadProgress', (evt) => {
        console.log(
          'Progress:',
          Math.round((evt.loaded / evt.total) * 100) + '%'
        );
      })
      .promise();

    await upload.then((data) => {
      console.log('File uploaded successfully:', data);
    });

    return Promise.resolve({
      file_key: file_key,
      file_name: file.name,
    });
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.ap-southeast-1.amazonaws.com/${file_key}`;
  return url;
}
