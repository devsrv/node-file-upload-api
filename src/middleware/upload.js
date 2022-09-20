const util = require('util')
const multer = require('multer')
const path = require('path')

const maxSize = 2 * 1024 * 1024

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(`${__basedir}/static/assets/uploads/`))
    },
    filename: (req, file, cb) => {
        const match = ['image/png', 'image/jpeg']

        if (match.indexOf(file.mimetype) === -1) {
            var message = `${file.originalname} is invalid. Only accept png/jpeg.`
            return cb(message, null)
        }

        var filename = `${Date.now()}-${file.originalname}`
        cb(null, filename)
    },
})

// single file
// let uploadFile = multer({
//     storage: storage,
//     limits: { fileSize: maxSize },
// }).single('avatar')

// multi file
let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).array('avatars', 2)

let uploadFileMiddleware = util.promisify(uploadFile)
module.exports = uploadFileMiddleware
