import multer from 'multer'
import path from 'path'
import fs from 'fs'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.body);
        
        const uploadPath = `proofs`;

        // Check if folder exists, create it if not
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {

        const uniqueFilename = `${Date.now()}${path.extname(file.originalname)}`;

        cb(null, uniqueFilename);
    }
});


export const fileupload = multer({ storage: storage });