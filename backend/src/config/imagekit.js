require('dotenv').config();
const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Helper function to upload images directly from buffer
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} fileName - Destination file name
 * @param {string} folder - Destination folder in ImageKit
 * @returns {Promise<string>} Uploaded file URL
 */
const uploadToImageKit = (buffer, fileName, folder) => {
  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: buffer,
        fileName: fileName,
        folder: folder,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.url);
      }
    );
  });
};

module.exports = { imagekit, uploadToImageKit };
