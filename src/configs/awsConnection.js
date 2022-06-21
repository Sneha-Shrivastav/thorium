const aws = require("aws-sdk")


aws.config.update({
    accessKeyId: "AKIAY3L35MCRVFM24Q7U",
    secretAccessKey: "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",
    region: "ap-south-1"
})



let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        let s3 = new aws.S3({ apiVersion: "2006-03-01" })
        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "sonuVerma/" + file.originalname,
            Body: file.buffer
        }
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }

            console.log("file uploaded successfull. Details are : ",data)
            return resolve(data.Location)
        }
        )
    }
    )
}




const uploadProfileImage = async function (profileImage) {
    try {
        let files = profileImage
        if (files && files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0])
            return uploadedFileURL
        }
        else return false
    }
    catch (err) {
        console.log(err)
    }
}




module.exports ={ uploadProfileImage,}