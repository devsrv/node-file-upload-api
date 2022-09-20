const uploadFile = require('../middleware/upload')
const fs = require('fs')
const path = require('path')
const baseUrl = 'http://localhost:8080/files/'
const directoryPath = path.join(`${__basedir}/static/assets/uploads/`)

const upload = async (req, res) => {
    try {
        await uploadFile(req, res)

        if (req.files.length <= 0) {
            return res.send({ message: `You must select at least 1 file.` })
        }

        res.status(200).send({
            message: req.files.length + ' files uploaded successfully',
        })
    } catch (err) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(422).send({ message: 'Too many files to upload.' })
        }

        if (err.code == 'LIMIT_FILE_SIZE') {
            return res.status(422).send({
                message: 'File size cannot be larger than 2MB!',
            })
        }

        res.status(500).send({
            message: `Could not upload the file: ${err}`,
        })
    }
}

const getListFiles = (req, res) => {
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: 'Unable to scan files!',
            })
        }

        let fileInfos = []

        files.forEach(file => {
            fileInfos.push({
                name: file,
                url: baseUrl + file,
            })
        })

        res.status(200).send(fileInfos)
    })
}

const download = (req, res) => {
    const fileName = req.params.name

    res.download(directoryPath + fileName, fileName, err => {
        if (err) {
            res.status(500).send({
                message: 'Could not download the file. ' + err,
            })
        }
    })
}

module.exports = {
    upload,
    getListFiles,
    download,
}
