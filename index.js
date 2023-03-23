const Storage = require('@google-cloud/storage').Storage;
const BaseAdapter = require('ghost-storage-base');

class GoogleCloudStorage extends BaseAdapter {
  constructor(config) {
    super();
    this.config = config;
    this.storage = new Storage({
      projectId: config.projectId,
      keyFilename: config.keyFilename
    });
    this.bucket = this.storage.bucket(config.bucketName);
  }
  
  save(file, targetDir) {
    return new Promise((resolve, reject) => {
      const options = {
        destination: `${targetDir}/${file.name}`,
        resumable: false,
        public: true,
      };
      
      this.bucket.upload(file.path, options, (err, file) => {
        if (err) {
          return reject(err);
        }
        resolve(file.publicUrl());
      });
    });
  }
  
  exists(fileName, targetDir) {
    return this.bucket.file(`${targetDir}/${fileName}`).exists();
  }
  
  serve() {
    return (req, res, next) => next();
  }
  
  delete(fileName, targetDir) {
    return this.bucket.file(`${targetDir}/${fileName}`).delete();
  }
  
  read(options) {
    return this.bucket.file(options.path).createReadStream();
  }
}

module.exports = GoogleCloudStorage;
