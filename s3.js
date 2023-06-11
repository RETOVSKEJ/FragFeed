require('dotenv').config()
const { Upload } = require('@aws-sdk/lib-storage'),
	{ S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const fs = require('fs')
const pathModule = require('path')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3Client({
	region,
	credentials: {
		accessKeyId,
		secretAccessKey,
	},
})

// uploads a file to s3
// file = multer file
async function uploadFile(file, newFilename) {
	console.log(file.buffer)
	const fileExt = pathModule.extname(file.originalname)

	const uploadParams = {
		Bucket: bucketName,
		Body: file.buffer,
		Key: `${newFilename}${fileExt}`,
		ContentType: file.mimetype,
	}

	const command = new PutObjectCommand(uploadParams)
	console.log(command)
	const result = await s3.send(command)
	return result
}

exports.uploadFile = uploadFile
// download a file from s3
