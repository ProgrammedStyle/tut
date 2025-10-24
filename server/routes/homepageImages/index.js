import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Upload to client/public directory - use absolute path
    const uploadPath = path.join(__dirname, '../../../client/public');
    console.log('Upload path:', uploadPath);
    
    // Ensure directory exists
    fs.mkdir(uploadPath, { recursive: true })
      .then(() => {
        console.log('Upload directory ready:', uploadPath);
        cb(null, uploadPath);
      })
      .catch((error) => {
        console.error('Error creating upload directory:', error);
        cb(error, null);
      });
  },
  filename: function (req, file, cb) {
    // Generate filename with timestamp first, we'll rename it later
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `temp_${uniqueSuffix}${ext}`;
    console.log('📁 [MULTER] Generated filename:', filename);
    console.log('📁 [MULTER] Original filename:', file.originalname);
    console.log('📁 [MULTER] File mimetype:', file.mimetype);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Upload new homepage image and delete old one
router.post('/upload', upload.single('image'), async (req, res) => {
  console.log('🔥 [ENDPOINT HIT] Upload endpoint was called!');
  try {
    console.log('🚀 [UPLOAD START] Upload request received');
    console.log('📋 [UPLOAD START] Request body:', req.body);
    console.log('📁 [UPLOAD START] Request file:', req.file);
    
    if (!req.file) {
      console.log('❌ [UPLOAD ERROR] No file provided');
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const { imageId, language, oldImagePath } = req.body;

    if (!imageId || !language) {
      console.log('❌ [UPLOAD ERROR] Missing parameters:', { imageId, language });
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: imageId and language'
      });
    }

    console.log('🔄 [UPLOAD PROCESS] Processing upload for:', { imageId, language, oldImagePath });
    console.log('📄 [UPLOAD PROCESS] Uploaded file info:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

           // Rename the uploaded file with proper language and image ID prefix
           const tempPath = path.join(__dirname, '../../../client/public', req.file.filename);
           const ext = path.extname(req.file.filename);
           const newFilename = `${language}_${imageId}_${Date.now()}${ext}`;
           const newPath = path.join(__dirname, '../../../client/public', newFilename);
    
    console.log('📂 [FILE PATHS] File paths:', {
      tempPath,
      newPath,
      tempExists: existsSync(tempPath),
      newFilename,
      uploadDir: path.join(__dirname, '../../../client/public')
    });
    
    // Check if temp file exists
    if (!existsSync(tempPath)) {
      console.error('❌ [FILE ERROR] Temp file does not exist:', tempPath);
      return res.status(500).json({
        success: false,
        message: 'Uploaded file not found on server'
      });
    }
    
    // Rename the file
    try {
      console.log('🔄 [RENAME START] Attempting to rename file...');
      await fs.rename(tempPath, newPath);
      console.log('✅ [RENAME SUCCESS] File renamed successfully from', req.file.filename, 'to', newFilename);
      
      // Verify the new file exists
      if (existsSync(newPath)) {
        console.log('✅ [VERIFY SUCCESS] New file exists at:', newPath);
      } else {
        console.error('❌ [VERIFY ERROR] New file does not exist at:', newPath);
        return res.status(500).json({
          success: false,
          message: 'File rename failed - new file not found'
        });
      }
    } catch (renameError) {
      console.error('❌ [RENAME ERROR] Error renaming file:', renameError);
      console.error('❌ [RENAME ERROR] Error details:', {
        code: renameError.code,
        errno: renameError.errno,
        syscall: renameError.syscall,
        path: renameError.path,
        dest: renameError.dest
      });
      throw renameError;
    }
    
    // Generate new image path
    const newImagePath = `/${newFilename}`;
    console.log('🎯 [SUCCESS] New image path:', newImagePath);
    console.log('🎯 [SUCCESS] File exists check:', existsSync(newPath));
    
    // Check file size and details
    try {
      const stats = await fs.stat(newPath);
      console.log('🎯 [SUCCESS] File size:', stats.size);
      console.log('🎯 [SUCCESS] File created:', stats.birthtime);
      console.log('🎯 [SUCCESS] File modified:', stats.mtime);
    } catch (statError) {
      console.error('🎯 [SUCCESS] Error getting file stats:', statError);
    }
    
    // List all files in public directory to verify
    try {
      const allFiles = await fs.readdir(path.join(__dirname, '../../../client/public'));
      console.log('🎯 [SUCCESS] All files in public directory:', allFiles);
      const uploadedFiles = allFiles.filter(file => file.includes(`${language}_${imageId}_`));
      console.log('🎯 [SUCCESS] Uploaded files matching pattern:', uploadedFiles);
    } catch (listError) {
      console.error('🎯 [SUCCESS] Error listing files:', listError);
    }

    // Delete old image if it exists and is not a default image
    if (oldImagePath && oldImagePath !== newImagePath) {
      try {
        const oldImageFullPath = path.join(__dirname, '../../../client/public', oldImagePath.replace('/', ''));
        console.log('Attempting to delete old image:', oldImageFullPath);
        
        // Check if file exists before trying to delete
        await fs.access(oldImageFullPath);
        
        // Only delete if it's not a default image (1.jpg, 3.jpg, etc.)
        const isDefaultImage = /^\/[0-9]+\.jpg$/.test(oldImagePath);
        if (!isDefaultImage) {
          await fs.unlink(oldImageFullPath);
          console.log(`✅ Deleted old image: ${oldImagePath}`);
        } else {
          console.log(`⚠️ Skipped deleting default image: ${oldImagePath}`);
        }
      } catch (error) {
        console.log(`⚠️ Could not delete old image ${oldImagePath}:`, error.message);
        // Don't fail the upload if we can't delete the old image
      }
    }

    console.log('Upload successful, returning response');
    res.json({
      success: true,
      message: 'Image uploaded and old image deleted successfully',
      newImagePath: newImagePath,
      imageId: imageId,
      language: language
    });

  } catch (error) {
    console.error('Image upload error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image: ' + error.message
    });
  }
});

// Get all homepage images
router.get('/', async (req, res) => {
  try {
    const { language } = req.query;
    
    // Default homepage images data
    const defaultImages = [
      { 
        id: 1, 
        name: "Damascus Gate", 
        ar: "باب العامود", 
        img: '/1.jpg',
        type: "Historic Gate"
      },
      { 
        id: 2, 
        name: "Al-Aqsa Mosque", 
        ar: "المسجد الاقصى", 
        img: '/3.jpg',
        type: "Sacred Site"
      },
      { 
        id: 3, 
        name: "Holy Sepulchre", 
        ar: "كنيسة القيامة", 
        img: '/4.jpg',
        type: "Religious Site"
      },
      { 
        id: 4, 
        name: "Jaffa Gate", 
        ar: "باب الخليل", 
        img: '/5.jpg',
        type: "Historic Gate"
      },
      { 
        id: 5, 
        name: "Muslim Quarter", 
        ar: "الحي الاسلامي", 
        img: '/6.jpg',
        type: "Historic Quarter"
      },
      { 
        id: 6, 
        name: "Markets", 
        ar: "الاسواق", 
        img: '/7.jpg',
        type: "Marketplace"
      },
      { 
        id: 7, 
        name: "Via Dolorosa", 
        ar: "طريق الالام", 
        img: '/8.jpg',
        type: "Sacred Path"
      },
      { 
        id: 8, 
        name: "New Gate", 
        ar: "باب الجديد", 
        img: '/9.jpg',
        type: "Historic Gate"
      },
      { 
        id: 9, 
        name: "Armenian Quarter", 
        ar: "الحي الارمني", 
        img: '/10.jpg',
        type: "Historic Quarter"
      },
      { 
        id: 10, 
        name: "Dung Gate", 
        ar: "باب المغاربة", 
        img: '/11.jpg',
        type: "Historic Gate"
      }
    ];

    // If language is specified, check for language-specific images
    if (language) {
      const publicDir = path.join(__dirname, '../../../client/public');
      
      // Check for language-specific images
      const languageSpecificImages = [];
      
      for (const image of defaultImages) {
        // Look for language-specific images with pattern: language_imageId_timestamp.ext
        // Match all common image extensions
        const languageSpecificFilenamePattern = new RegExp(`^${language}_${image.id}_.*\\.(jpg|jpeg|png|gif|webp|bmp)$`);
        
        let foundLanguageSpecific = false;
        const filesInPublic = await fs.readdir(publicDir);
        
        for (const file of filesInPublic) {
          if (languageSpecificFilenamePattern.test(file)) {
            languageSpecificImages.push({
              ...image,
              img: `/${file}` // Use the actual filename found
            });
            foundLanguageSpecific = true;
            break;
          }
        }
        
        if (!foundLanguageSpecific) {
          // No language-specific image found, use default
          languageSpecificImages.push(image);
        }
      }
      
      res.json({
        success: true,
        images: languageSpecificImages,
        language: language
      });
    } else {
      // No language specified, return default images
      res.json({
        success: true,
        images: defaultImages
      });
    }

  } catch (error) {
    console.error('Error fetching homepage images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch homepage images: ' + error.message
    });
  }
});

export default router;
