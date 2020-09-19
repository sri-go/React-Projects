const functions = require("firebase-functions");
const { Storage } = require("@google-cloud/storage");
const os = require("os");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs-extra");

const gcs = new Storage();

exports.resizeImages = functions.storage.object().onFinalize(async (object) => {
  try {
    const uniqueName = uuid.v1();
    const bucket = gcs.bucket(object.bucket); //which bucket to use to upload and download
    console.log("bucket", bucket);
    const filePath = object.name; //full path to file object in bucket
    console.log("filepath", filePath);
    const fileName = filePath.split("/").pop(); //name of file in bucket
    console.log("filename", fileName);
    const bucketDir = path.dirname(filePath); //directory from where the file came from
    console.log("bucketdir", bucketDir);

    const workingDir = path.join(os.tmpdir(), `thumbs`); //save thumbs in temp directory
    console.log("workingDir", workingDir);
    const tempFilePath = path.join(workingDir, `source.png`); //path to save source images
    console.log("tempFilePath", tempFilePath);

    //breakpoint to avoid infinite loop
    if (fileName.includes("image@") || !object.contentType.includes("image")) {
      return false;
    }

    //1. Ensure thumbnail dir exists
    await fs.ensureDir(workingDir);

    //2. Download source file to working directory
    await bucket.file(filePath).download({
      destination: tempFilePath,
    });
    //3. Resize the image to different size
    const sizes = [800];

    //each promise is upload operation back to bucket
    const uploadPromises = sizes.map(async (size) => {
      const thumbName = `thumb@${size}_${fileName}`; //thumbnail name
      const thumbPath = path.join(workingDir, thumbName); //full path to working dir where file will be saved

      //Resize source image
      await sharp(tempFilePath).resize(size, size).toFile(thumbPath);

      return bucket.upload(thumbPath, {
        destination: path.join(bucketDir, thumbName),
      });
    });
    await Promise.all(uploadPromises);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
  //Cleanup remove the temp thumbnails from filesystem
  return fs.remove(workingDir);
});

/*
Create and Deploy Your First Cloud Functions

https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});
*/
//
// exports.
