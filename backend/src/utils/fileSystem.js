const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

/**
 * Créer les dossiers nécessaires pour l'application
 */
async function createDirectories() {
  const directories = [
    path.join(__dirname, '../../uploads'),
    path.join(__dirname, '../../uploads/avatars'),
    path.join(__dirname, '../../uploads/events'),
    path.join(__dirname, '../../uploads/temp'),
    path.join(__dirname, '../../temp'),
    path.join(__dirname, '../../logs'),
    path.join(__dirname, '../../public')
  ];

  for (const dir of directories) {
    try {
      await fs.access(dir);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.mkdir(dir, { recursive: true });
        console.log(`📁 Dossier créé: ${dir}`);
      }
    }
  }
}

/**
 * Générer un nom de fichier unique
 */
function generateUniqueFilename(originalName, prefix = '') {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `${prefix}${timestamp}-${random}${ext}`;
}

/**
 * Valider le type de fichier
 */
function validateFileType(file, allowedTypes) {
  const fileExtension = path.extname(file.name).toLowerCase();
  const mimeType = file.mimetype;
  
  return allowedTypes.some(type => {
    if (type.startsWith('.')) {
      return fileExtension === type;
    }
    return mimeType.startsWith(type);
  });
}

/**
 * Valider la taille du fichier
 */
function validateFileSize(file, maxSizeInMB) {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * Traiter et optimiser une image
 */
async function processImage(inputPath, outputPath, options = {}) {
  const {
    width = 800,
    height = 600,
    quality = 80,
    format = 'jpeg'
  } = options;

  try {
    await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality })
      .toFile(outputPath);
    
    return true;
  } catch (error) {
    console.error('Erreur lors du traitement de l\'image:', error);
    return false;
  }
}

/**
 * Créer plusieurs tailles d'une image
 */
async function createImageVariants(inputPath, outputDir, filename) {
  const variants = {
    thumbnail: { width: 150, height: 150, quality: 70 },
    small: { width: 300, height: 200, quality: 75 },
    medium: { width: 600, height: 400, quality: 80 },
    large: { width: 1200, height: 800, quality: 85 }
  };

  const results = {};
  const baseName = path.parse(filename).name;

  for (const [size, options] of Object.entries(variants)) {
    const outputFilename = `${baseName}-${size}.jpg`;
    const outputPath = path.join(outputDir, outputFilename);
    
    const success = await processImage(inputPath, outputPath, options);
    if (success) {
      results[size] = outputFilename;
    }
  }

  return results;
}

/**
 * Supprimer un fichier de manière sécurisée
 */
async function deleteFile(filePath) {
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Erreur lors de la suppression du fichier:', error);
    }
    return false;
  }
}

/**
 * Supprimer plusieurs fichiers
 */
async function deleteFiles(filePaths) {
  const results = await Promise.allSettled(
    filePaths.map(filePath => deleteFile(filePath))
  );
  
  return results.map((result, index) => ({
    path: filePaths[index],
    success: result.status === 'fulfilled' && result.value
  }));
}

/**
 * Nettoyer les fichiers temporaires anciens
 */
async function cleanupTempFiles(maxAgeInHours = 24) {
  const tempDir = path.join(__dirname, '../../temp');
  const maxAge = maxAgeInHours * 60 * 60 * 1000; // en millisecondes
  
  try {
    const files = await fs.readdir(tempDir);
    const now = Date.now();
    
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stats = await fs.stat(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        await deleteFile(filePath);
        console.log(`🗑️ Fichier temporaire supprimé: ${file}`);
      }
    }
  } catch (error) {
    console.error('Erreur lors du nettoyage des fichiers temporaires:', error);
  }
}

/**
 * Obtenir les informations d'un fichier
 */
async function getFileInfo(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory()
    };
  } catch (error) {
    return null;
  }
}

/**
 * Calculer la taille d'un dossier
 */
async function getFolderSize(folderPath) {
  let totalSize = 0;
  
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(folderPath, file.name);
      
      if (file.isDirectory()) {
        totalSize += await getFolderSize(filePath);
      } else {
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
      }
    }
  } catch (error) {
    console.error('Erreur lors du calcul de la taille du dossier:', error);
  }
  
  return totalSize;
}

/**
 * Formater la taille en bytes en format lisible
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Vérifier l'espace disque disponible
 */
async function checkDiskSpace() {
  try {
    const stats = await fs.statfs(process.cwd());
    const free = stats.bavail * stats.bsize;
    const total = stats.blocks * stats.bsize;
    const used = total - free;
    
    return {
      free: formatFileSize(free),
      used: formatFileSize(used),
      total: formatFileSize(total),
      percentage: Math.round((used / total) * 100)
    };
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'espace disque:', error);
    return null;
  }
}

/**
 * Copier un fichier
 */
async function copyFile(source, destination) {
  try {
    await fs.copyFile(source, destination);
    return true;
  } catch (error) {
    console.error('Erreur lors de la copie du fichier:', error);
    return false;
  }
}

/**
 * Déplacer un fichier
 */
async function moveFile(source, destination) {
  try {
    await fs.rename(source, destination);
    return true;
  } catch (error) {
    // Si rename échoue (différents systèmes de fichiers), copier puis supprimer
    const copied = await copyFile(source, destination);
    if (copied) {
      await deleteFile(source);
      return true;
    }
    return false;
  }
}

module.exports = {
  createDirectories,
  generateUniqueFilename,
  validateFileType,
  validateFileSize,
  processImage,
  createImageVariants,
  deleteFile,
  deleteFiles,
  cleanupTempFiles,
  getFileInfo,
  getFolderSize,
  formatFileSize,
  checkDiskSpace,
  copyFile,
  moveFile
};