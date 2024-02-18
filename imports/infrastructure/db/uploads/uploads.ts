import { FilesCollection } from 'meteor/ostrio:files';

export const ImagesCollection = new FilesCollection({
  collectionName: 'Images',
  storagePath: '/uploads/news', // Adjust the storage path as needed
  allowClientCode: false, // Disallow direct uploads from clients
  onBeforeUpload(file) {
    // Add any validation logic here, e.g., file type and size checks
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'File upload error: Invalid file type or size limit (10MB)';
    }
  },
});

export type PdfMeta = {
  stockTakeId?: string,
}

export const PdfCollection = new FilesCollection<PdfMeta>({
  collectionName: 'Pdfs',
  storagePath: '/uploads/pdfs', // Adjust the storage path as needed
  allowClientCode: false, // Disallow direct uploads from clients
  onBeforeUpload(file) {
    // Add any validation logic here, e.g., file type and size checks
    if (file.size <= 10485760 && /pdf/i.test(file.extension)) {
      return true;
    } else {
      return 'File upload error: Invalid file type or size limit (10MB)';
    }
  },
})
