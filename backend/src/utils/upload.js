const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const { AppError } = require('../middleware/errorHandler');
const { generateUniqueFilename, validateFileType } = require('./fileSystem');

// Configuration de stockage pour les images d'événements
const eventImageStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/events');
    try {
      await fs.access(uploadPath);
    } catch (error) {
      await fs.mkdir(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = generateUniqueFilename(file.originalname, 'event-');
    cb(null, uniqueName);
  }
});

// Configuration de stockage pour les avatars
const avatarStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/avatars');
    try {
      await fs.access(uploadPath);
    } catch (error) {
      await fs.mkdir(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = generateUniqueFilename(file.originalname, 'avatar-');
    cb(null, uniqueName);
  }
});

// Filtre pour les images
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (validateFileType(file, allowedTypes) && allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Seuls les fichiers image (JPG, PNG, GIF, WebP) sont autorisés', 400), false);
  }
};

// Configuration multer pour les images d'événements
const uploadEventImages = multer({
  storage: eventImageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // Maximum 5 fichiers
  }
});

// Configuration multer pour les avatars
const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 1 // Un seul fichier
  }
});

/**
 * Middleware pour traiter les images d'événements après upload
 */
const processEventImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    const processedImages = [];

    for (const file of req.files) {
      const originalPath = file.path;
      const filename = file.filename;
      const nameWithoutExt = path.parse(filename).name;
      const outputDir = path.dirname(originalPath);

      // Créer différentes tailles
      const sizes = [
        { suffix: '_thumb', width: 300, height: 200 },
        { suffix: '_medium', width: 800, height: 600 },
        { suffix: '_large', width: 1200, height: 800 }
      ];

      const imageVersions = {
        original: `/uploads/events/${filename}`,
        thumbnail: '',
        medium: '',
        large: ''
      };

      for (const size of sizes) {
        const outputFilename = `${nameWithoutExt}${size.suffix}.webp`;
        const outputPath = path.join(outputDir, outputFilename);

        await sharp(originalPath)
          .resize(size.width, size.height, {
            fit: 'cover',
            position: 'center'
          })
          .webp({ quality: 85 })
          .toFile(outputPath);

        const sizeKey = size.suffix.substring(1); // Enlever le '_'
        imageVersions[sizeKey] = `/uploads/events/${outputFilename}`;
      }

      // Convertir l'original en WebP aussi
      const originalWebpFilename = `${nameWithoutExt}_original.webp`;
      const originalWebpPath = path.join(outputDir, originalWebpFilename);
      
      await sharp(originalPath)
        .webp({ quality: 90 })
        .toFile(originalWebpPath);

      imageVersions.original = `/uploads/events/${originalWebpFilename}`;

      // Supprimer le fichier original non-WebP
      await fs.unlink(originalPath);

      processedImages.push({
        filename: originalWebpFilename,
        originalName: file.originalname,
        size: file.size,
        mimetype: 'image/webp',
        versions: imageVersions
      });
    }

    req.processedImages = processedImages;
    next();
  } catch (error) {
    console.error('Erreur lors du traitement des images:', error);
    next(new AppError('Erreur lors du traitement des images', 500));
  }
};

/**
 * Middleware pour traiter l'avatar après upload
 */
const processAvatar = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const originalPath = req.file.path;
    const filename = req.file.filename;
    const nameWithoutExt = path.parse(filename).name;
    const outputDir = path.dirname(originalPath);

    // Créer différentes tailles pour l'avatar
    const sizes = [
      { suffix: '_small', size: 50 },
      { suffix: '_medium', size: 150 },
      { suffix: '_large', size: 300 }
    ];

    const avatarVersions = {
      original: '',
      small: '',
      medium: '',
      large: ''
    };

    for (const sizeConfig of sizes) {
      const outputFilename = `${nameWithoutExt}${sizeConfig.suffix}.webp`;
      const outputPath = path.join(outputDir, outputFilename);

      await sharp(originalPath)
        .resize(sizeConfig.size, sizeConfig.size, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 85 })
        .toFile(outputPath);

      const sizeKey = sizeConfig.suffix.substring(1); // Enlever le '_'
      avatarVersions[sizeKey] = `/uploads/avatars/${outputFilename}`;
    }

    // Convertir l'original en WebP
    const originalWebpFilename = `${nameWithoutExt}_original.webp`;
    const originalWebpPath = path.join(outputDir, originalWebpFilename);
    
    await sharp(originalPath)
      .resize(500, 500, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 90 })
      .toFile(originalWebpPath);

    avatarVersions.original = `/uploads/avatars/${originalWebpFilename}`;

    // Supprimer le fichier original
    await fs.unlink(originalPath);

    req.processedAvatar = {
      filename: originalWebpFilename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: 'image/webp',
      versions: avatarVersions
    };

    next();
  } catch (error) {
    console.error('Erreur lors du traitement de l\'avatar:', error);
    next(new AppError('Erreur lors du traitement de l\'avatar', 500));
  }
};

/**
 * Supprimer un fichier image
 */
async function deleteImage(imagePath) {
  try {
    const fullPath = path.join(__dirname, '../../', imagePath);
    await fs.unlink(fullPath);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error);
    return false;
  }
}

/**
 * Supprimer toutes les versions d'une image
 */
async function deleteImageVersions(imageVersions) {
  const deletionPromises = [];
  
  for (const [key, imagePath] of Object.entries(imageVersions)) {
    if (imagePath && typeof imagePath === 'string') {
      deletionPromises.push(deleteImage(imagePath));
    }
  }
  
  try {
    await Promise.all(deletionPromises);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression des versions d\'image:', error);
    return false;
  }
}

/**
 * Valider la taille et le type d'image
 */
function validateImageUpload(file, maxSize = 5 * 1024 * 1024) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!allowedTypes.includes(file.mimetype)) {
    throw new AppError('Type de fichier non autorisé. Seuls JPG, PNG, GIF et WebP sont acceptés.', 400);
  }
  
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    throw new AppError(`La taille du fichier ne doit pas dépasser ${maxSizeMB}MB.`, 400);
  }
  
  return true;
}

module.exports = {
  uploadEventImages,
  uploadAvatar,
  processEventImages,
  processAvatar,
  deleteImage,
  deleteImageVersions,
  validateImageUpload
};