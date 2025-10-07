import multer from 'multer';
import path from 'path';
const __dirname = path.resolve();
const storage = multer.diskStorage({
    destination: __dirname + '/files',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

 const upload = multer({
    storage: storage,
    limits: { fileSize: 20000000 }
});


export default upload;