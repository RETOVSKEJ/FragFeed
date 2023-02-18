const multer = require('multer')
const path = require('path')
const fs = require('fs')

const diskStorage = multer.diskStorage({      
    destination: (req, file, cb)  => {  // callback function WHERE TO STORE IMAGES
        cb(null, 'public/assets/uploads')              // cb(error / dest) //TODO ERROR ZROBIC
    },  
    filename:  (req, file, cb) => {         // without filenames, would store with original name 
        console.log("zdjecie dodane: \n", file);
        cb(null, `uploaded`)    // 'uploaded' because we're renaming it instantly in controllers // the standard is to add a date  // .originalname to nazwa na komputerze uploadujacego
    }                             
})


/// Adds extnames automatically
/// stores images in uploads, used instead of multer when post is previewed. 
/// stores compressed images
async function storeImage(data, uploadedFilename, newFilename){
    const fileExt = path.extname(uploadedFilename)
    let filePath = path.join(process.cwd(), 'public', 'assets', 'uploads', `${newFilename}${fileExt}`)
    const buffer = storeBase64inBuffer(data, fileExt)
    try{
        await storeBufferinFile(buffer, filePath)
    } catch (err) {  
        throw new Error('Image storing failed') 
    }
      
    return filePath
}

function storeBase64inBuffer(data, uploadedFilename){              //// SEPARATES DATA FROM MIMETYPE AND RETURNS BUFFER       
    const filetype = /\.jpeg|\.JPEG|\.jpg|\.JPG|\.jfif|\.JFIF|\.pjp|\.PJP|\.png|\.PNG|\.webp|\.WEBP|\.svg|\.SVG|\.gif|\.GIF/;
    const isImage = filetype.test(uploadedFilename)
    if(!isImage)
        return console.error('File is not an image');
        
    const arr = data.split(',')
    const dataArr = arr[1]
 // const mime = arr[0].match(/:(.*?);/)[1]

    return Buffer.from(dataArr, 'base64')      
}

async function storeBufferinFile(buffer, FilePath){  
    try {
        await fs.promises.writeFile(FilePath, buffer)
        console.log('IMAGE BUFFER STORED')
        return true
    } catch (error) {
        console.error('NIE udalo sie wrzucic pliku', error)
        return false
    }
}       /// RETURNS successFlag
    
const uploadDisk = multer({storage: diskStorage, limits: {fileSize: 10_000_000}})  // 10mb

module.exports = { uploadDisk, storeImage  } 