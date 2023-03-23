# ghost-gcp-storage-adapter
Ghost adapter to store images into Google Cloud Storage

## Instalation
### Google Cloud Storage Configuration
1. Create a project from Google Cloud Console
2. Be sure that `Google Cloud Storage API` is enable in `APIs & Services > Library`
3. Create a new Service Account in `IAM & Admin > Service Accounts`
4. Create new credentials for your service account in `IAM & Admin > Service Accounts > <Your Service Account> > Actions > Manage Keys > Add Key`
5. Download your credentials as a JSON file and renamed it to `credentials.json`

### Server Configuration
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

6. Restart Ghost
