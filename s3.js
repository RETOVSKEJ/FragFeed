require('dotenv').config()
const {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
} = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
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
	const uploadParams = {
		Bucket: bucketName,
		Body: file.buffer,
		Key: newFilename,
		ContentType: file.mimetype,
	}

	const command = new PutObjectCommand(uploadParams)
	const result = await s3.send(command)
	return result
}

// download a file from s3

async function getImage(filename) {
	const getObjectParams = {
		Bucket: bucketName,
		Key: filename,
	}
	const command = new GetObjectCommand(getObjectParams)
	const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
	return url
}

module.exports = { uploadFile, getImage }
