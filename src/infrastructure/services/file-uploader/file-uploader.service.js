import multer from 'multer';
import envVars from "../../../config/env-vars.js";
import storage from "../../database/file-storage/disk-storage.js";

export class FileService {
    constructor() {
        this.uploader = multer({
            storage: storage,
            limits: {fileSize: 10000000}
        });
        this.baseUrl = envVars.BASE_URL
    }


    async saveFile(req, res, fieldName) {
        return new Promise((resolve, reject) => {
            const upload = this.uploader.single(fieldName);
            upload(req, res, (error) => {
                if (error) {
                    reject(error);
                } else {
                    if (req.file) {
                        // Agregar la URL completa al objeto file
                        req.file.url = `${this.baseUrl}/uploads/${req.file.filename}`;
                    }
                    resolve(req.file);
                }
            });
        });
    }

    generateImageUrl(filename) {
        return filename ? `${this.baseUrl}/uploads/${filename}` : null;
    }
}