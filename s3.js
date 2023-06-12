require('dotenv').config()
const {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
} = require('@aws-sdk/client-s3')
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
// file = multer file  (IT HAS TO BE memoryStorage() to have access to file.buffer)

const ObjectParams = {
	Bucket: bucketName,
	Key: '',
}

async function uploadFile(file, newFilename) {
	const params = {
		Bucket: bucketName,
		Body: file.buffer,
		Key: newFilename,
		ContentType: file.mimetype,
	}

	const command = new PutObjectCommand(params)
	const result = await s3.send(command)
	return true
}

async function deleteFile(filename) {
	ObjectParams.Key = filename

	const command = new DeleteObjectCommand(ObjectParams)
	await s3.send(command)
}

// download a file from s3

async function getImage(filename) {
	// Check if the signed URL exists in the cache
	// const cachedURL = await cache.get(filename)
	// if (cachedURL) {
	// 	return cachedURL
	// }

	ObjectParams.Key = filename
	const command = new GetObjectCommand(ObjectParams)
	const result = await s3.send(command)
	console.log(result)

	// await cache.set(filename, url)
	return result
}

/// OLD ARCHITECTURE - cached signedUrls

// async function setImage(post) {
// 	// TODO memoization / redis
// 	// const cachedURL = await cache.get(post.image)
// 	// if (cachedURL) {
// 	// 	return cachedURL
// 	// }

// 	getObjectParams.Key = post.image
// 	const command = new GetObjectCommand(getObjectParams)
// 	const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
// 	// await cache.set(post.image, url)

// 	post.image = url

// 	return true
// }

// async function setImages(posts) {
// 	const postPromises = posts.map(async (post) => {
// 		if (post.image) {
// 			post.image = await getImage(post.image)
// 		}
// 	})
// 	const postsWithSignedUrl = await Promise.allSettled(postPromises)
// 	console.log(postsWithSignedUrl)
// 	return true
// }

module.exports = { uploadFile, getImage, deleteFile }
