import multer from 'multer';
import storage from "../database/file-storage/disk-storage.js";
export const upload = multer({
    storage: storage,
    limits: {fileSize: 10000000}
});
