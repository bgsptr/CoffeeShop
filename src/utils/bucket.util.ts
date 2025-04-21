import { File, Storage } from '@google-cloud/storage';

export class GoogleCloudBucketUtil {
  private storage: Storage;

  constructor() {
    this.storage = new Storage({
      keyFilename: 'D:/.PKL/be-cafe-candra/src/bucket-credential-candra.json'
    });
  }

  private getBucket(bucketName: string) {
    return this.storage.bucket(bucketName);
  }

  private getFileOrBlob(destFileName: string, bucketName: string) {
    const selectedBucket = this.getBucket(bucketName);
    return selectedBucket.file(destFileName);
  }

  private fileOrBlobStream(
    file: File,
    fileData: Express.Multer.File,
    bucketName: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const blobStream = file.createWriteStream({
        metadata: {
          contentType: fileData.mimetype,
        },
      });

      blobStream.on('finish', () => {
        console.log('file successfully uploaded');
        resolve(`https://storage.googleapis.com/${bucketName}/${file.name}`);
      });

      blobStream.on('error', (err) => {
        console.error(`Error file uploading: ${err}`);
        reject(err);
      });

      // write data with buffer shape to stream
      blobStream.end(fileData.buffer);
    });
  }

  public async uploadImageToBucketFromMemory(
    fileData: Express.Multer.File,
    bucketName: string,
    destFileName: string,
  ) {
    const file: File = this.getFileOrBlob(destFileName, bucketName);

    try {
      const data = await this.fileOrBlobStream(file, fileData, bucketName);
      console.log(data);
      
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
