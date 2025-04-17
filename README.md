# ghost-gcp-storage-adapter
Ghost adapter to store images, media files, and other files into Google Cloud Storage.

![npm](https://img.shields.io/npm/v/ghost-gcp-storage-adapter?color=blue&label=NPM%20Version)
![ghost](https://img.shields.io/badge/Ghost%20Version-5.x-blue)

## :arrow_down: Installation
### Google Cloud Storage Configuration
1. Create a project from Google Cloud Console
2. Be sure that `Google Cloud Storage API` is enable in `APIs & Services > Library`
3. Create a new Service Account in `IAM & Admin > Service Accounts`
4. Create new credentials for your service account in `IAM & Admin > Service Accounts > <Your Service Account> > Actions > Manage Keys > Add Key`
5. Download your credentials as a JSON file and renamed it to `credentials.json`
6. Create a bucket to store your files (use Fine-grained access control)

### Server Configuration for production
1. Go to your Ghost instalation folder (the folder where you have the files `config.production.json` or `config.development.json`):
```bash
cd /your/ghost/instalation/folder
```

2. Create the `adapters/storage` folder inside the `content` folder:
```bash
mkdir -p content/adapters/storage
```

3. Install this package via NPM:
```bash
npm i ghost-gcp-storage-adapter
```

4. Copy the installed package into `content/adapters/storage`:
```bash
cp -r node_modules/ghost-gcp-storage-adapter content/adapters/storage/ghost-gcp-storage-adapter
```

5. Copy your `credentials.json` file into `content/adapters/storage/ghost-gcp-storage-adapter`

7. Add the following configuration to your `config.production.json` file:
```json
"storage": {
  "active": "ghost-gcp-storage-adapter",    // For images
  "media": "ghost-gcp-storage-adapter",     // For video and audio files
  "files": "ghost-gcp-storage-adapter",     // For other file types
  "ghost-gcp-storage-adapter": {
    "projectId": "<your_google_cloud_project_id>",
    "keyFilename": "<your_ghost_instalation_folder>/content/adapters/storage/ghost-gcp-storage-adapter/credentials.json",
    "bucketName": "<your_bucket_name>"
  }
}
```

Storage Configuration Options:
- `active`: Controls the storage adapter for images
- `media`: Controls the storage adapter for video and audio files
- `files`: Controls the storage adapter for other file types

6. Restart Ghost

### Docker Deployment
If you're running Ghost in Docker, follow these steps:

1. Clone and prepare the adapter:
```bash
# Clone this repository
git clone https://github.com/vcgtz/ghost-gcp-storage-adapter.git
cd ghost-gcp-storage-adapter

# Install dependencies
npm install
```

2. Update your `docker-compose.yml` to mount the necessary volumes:
```yaml
version: '3'
services:
  ghost:
    image: ghost:5-alpine
    volumes:
      # Mount config.production.json
      - ./config.production.json:/var/lib/ghost/config.production.json
      # Mount the storage adapter
      - ./ghost-gcp-storage-adapter:/var/lib/ghost/content/adapters/storage/ghost-gcp-storage-adapter
      # Mount credentials.json (ensure it's in your project directory)
      - ./credentials.json:/var/lib/ghost/content/adapters/storage/ghost-gcp-storage-adapter/credentials.json
    // ... other configurations ...
```

3. Ensure your `config.production.json` includes the storage configuration:
```json
{
  // ... other configurations ...
  "storage": {
    "active": "ghost-gcp-storage-adapter",    // For images
    "media": "ghost-gcp-storage-adapter",     // For video and audio files
    "files": "ghost-gcp-storage-adapter",     // For other file types
    "ghost-gcp-storage-adapter": {
      "projectId": "<your_google_cloud_project_id>",
      "keyFilename": "/var/lib/ghost/content/adapters/storage/ghost-gcp-storage-adapter/credentials.json",
      "bucketName": "<your_bucket_name>"
    }
  }
}
```

4. Start your Docker containers:
```bash
docker-compose up -d
```

Note: Make sure the file permissions are correct and the credentials.json file is accessible within the container.

### Configuration for development
If you want to contribute or test this adapter, you can use it locally by following the next instructions:

1. Follow the same steps to configure Google Cloud Storage
2. Fork this repo
3. Clone your fork in your computer
4. Install Ghost locally [(Instructions)](https://ghost.org/docs/install/local/)
5. In the folder where you installed Ghost, install the adapter locally
```bash
cd ghost_folder/
npm install /path/to/your/forked/repo
```
6. Create the `adapters/storage` folder inside the `content` folder:
```bash
mkdir -p content/adapters/storage
```
7. Copy the installed package into `content/adapters/storage`:
```bash
cp -r node_modules/ghost-gcp-storage-adapter content/adapters/storage/ghost-gcp-storage-adapter
```
8. Copy your `credentials.json` file into `content/adapters/storage/ghost-gcp-storage-adapter`
9. Stop Ghost and running it in `development` mode by using:
```bash
NODE_ENV=development ghost run
```

With this you'be able to see the logs in real time and test and debug this package.

## :page_with_curl: License
[MIT](https://github.com/vcgtz/ghost-gcp-storage-adapter/blob/main/LICENSE)
