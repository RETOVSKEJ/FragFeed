const multer = require('multer')
const path = require('path')

const MemoryStorage = multer.memoryStorage();
const diskStorage = multer.diskStorage({      
    destination: (req, file, cb)  => {  // callback function WHERE TO STORE IMAGES
        cb(null, 'public/assets/uploads')              // cb(error / dest) //TODO ERROR ZROBIC
    },  
    filename:  (req, file, cb) => {         // without filenames, would store with original name 
        console.log("zdjecie dodane: \n", file);
        cb(null, `${Date.now()}${path.extname(file.originalname)}`)    // the standard is to add a date  // .originalname to nazwa na komputerze uploadujacego
    }                             
})


const uploadDisk = multer({storage: diskStorage, limits: {fileSize: 10_000_000}})  // 10mb
const uploadMemory = multer({storage: MemoryStorage, limits: {fileSize: 10_000_000}}) // 10mb

module.exports = { uploadDisk, uploadMemory } 

