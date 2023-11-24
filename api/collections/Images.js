// ./imports/api/Images.js
// @ts-ignore
import { FilesCollection } from 'meteor/ostrio:files';

const ImagesCollection = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: false, // Disallow remove files from client browser
  storagePath: 'assets/app/uploads/Images', // Provide the storage path
  onBeforeUpload (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image, with size equal or less than 10MB';
  },
});

export default ImagesCollection;
