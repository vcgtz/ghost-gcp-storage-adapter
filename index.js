const { Storage } = require('@google-cloud/storage');
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

  save(file) {
    return new Promise((resolve, reject) => {
      const options = {
        destination: file.name,
        resumable: false,
        public: true,
      };

      this.bucket.upload(file.path, options)
        .then(data => {
          resolve(data.shift().publicUrl());
        })
        .catch(err => reject(err));
    });
  }
  
  exists(fileName) {
    return new Promise((resolve, reject) => {
      this.bucket.file(fileName).exists()
        .then(exists => resolve(exists))
        .catch(err => reject(err));
    });
  }
  
  serve() {
    return (req, res, next) => next();
  }
  
  delete(fileName) {
    return new Promise((resolve, reject) => {
      this.bucket.file(fileName).delete()
        .then(() => resolve())
        .catch(err => reject(err));
    });
  }
  
  read(options) {
    return this.bucket.file(options.path).createReadStream();
  }
}

module.exports = GoogleCloudStorage;
