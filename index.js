const { Storage } = require('@google-cloud/storage');
const BaseAdapter = require('ghost-storage-base');
const path = require('path');
const URL = require('url').URL;

class GoogleCloudStorage extends BaseAdapter {
  constructor(config) {
    super();
    this.config = config;
    this.storage = new Storage({
      projectId: this.config.projectId,
      keyFilename: this.config.keyFilename
    });

    this.bucket = this.storage.bucket(this.config.bucketName);
  }

  async save(file, targetDir = this.getTargetDir()) {
    // Ensure target directory exists and is properly formatted
    targetDir = targetDir || this.getTargetDir();
    
    // Build complete file path
    const fileName = path.join(targetDir, file.name).replace(/\\/g, '/');

    const options = {
      destination: fileName,
      resumable: false,
      public: true,
      metadata: {
        cacheControl: `public, max-age=2678400`
      }
    };

    try {
      const [uploadedFile] = await this.bucket.upload(file.path, options);
      return uploadedFile.publicUrl();
    } catch (err) {
      console.error('Save error:', err);
      throw err;
    }
  }

  urlToPath(url) {
    try {
      // Parse URL
      const parsedUrl = new URL(url);
      
      let filePath;
      if (parsedUrl.hostname === 'storage.googleapis.com') {
        // Extract file path from URL, remove leading /bucketName/
        const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
        // Remove first element (bucket name)
        pathParts.shift();
        // Decode URL-encoded path
        filePath = pathParts.map(part => decodeURIComponent(part)).join('/');
      } else {
        // For other cases, use pathname directly and remove leading slashes
        filePath = decodeURIComponent(parsedUrl.pathname.replace(/^\/+/, ''));
      }

      return filePath;
    } catch (err) {
      console.warn(`URL parsing failed for ${url}, falling back to basic string handling`);
      // If parsing fails, try basic string handling
      const urlWithoutQuery = decodeURIComponent(url.split('?')[0]);
      const matches = urlWithoutQuery.match(/storage\.googleapis\.com\/[^/]+\/(.+)$/);
      if (matches && matches[1]) {
        return matches[1];
      }
      return decodeURIComponent(urlWithoutQuery.split('/').pop());
    }
  }

  // Get target directory method
  getTargetDir(baseDir = '') {
    const date = new Date();
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    
    return path.join(baseDir, String(year), month);
  }

  exists(fileName, targetDir) {
    const filePath = path.join(targetDir || '', fileName).replace(/\\/g, '/');
    return this.bucket.file(filePath).exists().then(([exists]) => exists);
  }

  serve() {
    return (req, res, next) => next();
  }

  async delete(fileName, targetDir) {
    const filePath = path.join(targetDir || '', fileName).replace(/\\/g, '/');
    return await this.bucket.file(filePath).delete().catch((err) => {
      console.warn(`Delete failed for ${filePath}:`, err);
    });
  }

  read(options) {
    const filePath = options.path.replace(/\\/g, '/');
    return this.bucket.file(filePath).createReadStream();
  }
}

module.exports = GoogleCloudStorage;