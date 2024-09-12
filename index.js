const { Storage } = require("@google-cloud/storage");
const BaseAdapter = require("ghost-storage-base");

class GoogleCloudStorage extends BaseAdapter {
  constructor(config) {
    super();
    this.config = config;
    this.storage = new Storage({
      projectId: this.config.projectId,
      keyFilename: this.config.keyFilename,
    });

    this.bucket = this.storage.bucket(this.config.bucketName);
  }

  async save(file) {
    const options = {
      destination: file.name,
      resumable: false,
      metadata: {
        cacheControl: `public, max-age=2678400`,
      },
    };

    try {
      const [uploadedFile] = await this.bucket.upload(file.path, options);

      return uploadedFile.publicUrl();
    } catch (err) {
      console.error(err);
    }
  }

  async exists(fileName) {
    const [exists] = await this.bucket.file(fileName).exists();

    return exists;
  }

  serve() {
    return (req, res, next) => next();
  }

  async delete(fileName) {
    return await this.bucket.file(fileName).delete();
  }

  read(options) {
    return this.bucket.file(options.path).createReadStream();
  }
}

module.exports = GoogleCloudStorage;
