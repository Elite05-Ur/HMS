const { ImageKit } = require('@imagekit/nodejs');

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(file) {
  const result = await client.files.upload({
    file,
    fileName: 'patient_' + Date.now(),
    folder: 'HMS/patient_dps'
  });
  return result;
}

module.exports = { uploadFile };