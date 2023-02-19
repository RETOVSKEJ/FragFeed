const multer = require('multer')
const pathModule = require('path')
const fs = require('fs')
const sharp = require('sharp')

// MULTER customStorage REQUIERES TO HANDLE 2 functions:
// _handleFile and _removeFile

// default destination (if is not provided in new myCustomStorage)
function getDestination(req, file, cb) {
	cb(null, 'public/assets/uploads')
}

function MyCustomStorage(opts) {
	this.getDestination = opts.destination || getDestination
}

MyCustomStorage.prototype._handleFile = function _handleFile(req, file, cb) {
	this.getDestination(req, file, (err, path) => {
		if (err) return cb(err)

		const outStream = fs.createWriteStream(path)
		const compressedImage = sharp().jpeg({ quality: 80 }) // default

		file.stream.pipe(compressedImage).pipe(outStream)
		outStream.on('error', (err) => {
			console.error('custom storage write stream error:', err)
		})
		outStream.on('finish', () => {
			cb(null, {
				/// new PROPERTIES WE ADD to our req.file
				filename: 'uploaded',
				destination: pathModule.join('public', 'assets', 'uploads'),
				path,
				size: outStream.bytesWritten,
			})
		}) 
	})
}

MyCustomStorage.prototype._removeFile = function _removeFile(req, file, cb) {
	fs.unlink(file.path, () => {
		console.log('myCustomStorage FILE DELETED')
	})
}

const uploadCompressedDisk = multer({
	storage: new MyCustomStorage({
		destination(req, file, cb) {
			cb(
				null,
				pathModule.resolve('public', 'assets', 'uploads', 'uploaded')
			)
		},
		/// / MULTER BUG   -> cannot set filename here, destination is full path to the new file
	}),
	limits: { fileSize: 5_100_000 },
}) // jesli przekroczymy, wyskoczy sharp Error: VipsJpeg:

module.exports = { uploadCompressedDisk, storeImage }

///
/// HELPER FUNCTIONS
///

/// Adds extnames automatically
/// stores images in uploads, used instead of multer when post is previewed.
/// stores compressed images
async function storeImage(data, uploadedFilename, newFilename) {
	const fileExt = pathModule.extname(uploadedFilename)
	const filePath = pathModule.resolve(
		'public',
		'assets',
		'uploads',
		`${newFilename}${fileExt}`
	)
	const buffer = storeBase64inBuffer(data, fileExt)
	try {
		await storeBufferinFile(buffer, filePath)
	} catch (err) {
		throw new Error('Image storing failed')
	}

	return filePath
}

function storeBase64inBuffer(data, uploadedFilename) {
	/// / SEPARATES DATA FROM MIMETYPE AND RETURNS BUFFER
	const filetype =
		/\.jpeg|\.JPEG|\.jpg|\.JPG|\.jfif|\.JFIF|\.pjp|\.PJP|\.png|\.PNG|\.webp|\.WEBP|\.svg|\.SVG|\.gif|\.GIF/
	const isImage = filetype.test(uploadedFilename)
	if (!isImage) {
		return console.error('File is not an image')
	}

	const arr = data.split(',')
	const dataArr = arr[1]
	// const mime = arr[0].match(/:(.*?);/)[1]

	return Buffer.from(dataArr, 'base64')
}

async function storeBufferinFile(buffer, FilePath) {
	try {
		await fs.promises.writeFile(FilePath, buffer)
		console.log('IMAGE BUFFER STORED')
		return true
	} catch (error) {
		console.error('NIE udalo sie wrzucic pliku', error)
		return false
	}
} /// RETURNS successFlag

/// // DEPRECATED
// const diskStorage = multer.diskStorage({
//     destination: (req, file, cb)  => {  // callback function WHERE TO STORE IMAGES
//         cb(null, 'public/assets/uploads')              // cb(error / dest) //TODO ERROR ZROBIC
//     },
//     filename:  (req, file, cb) => {         // without filenames, would store with original name
//         console.log("zdjecie dodane: \n", file);
//         cb(null, `uploaded`)    // 'uploaded' because we're renaming it instantly in controllers // the standard is to add a date  // .originalname to nazwa na komputerze uploadujacego
//     }
// })
// const uploadDisk = multer({storage: diskStorage, limits: {fileSize: 10_000_000}})  // 10mb
