const app = require('./app');
const { sequelize } = require('./models');
const { createDirectories } = require('./utils/fileSystem');

// Configuration du port
const PORT = process.env.PORT || 5000;

// Fonction pour démarrer le serveur
async function startServer() {
  try {
    console.log('🚀 Démarrage du serveur...');
    
    // Créer les dossiers nécessaires
    await createDirectories();
    console.log('📁 Dossiers créés avec succès');
    
    // Tester la connexion à la base de données
    console.log('🔌 Connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie avec succès');
    
    // Synchroniser les modèles avec la base de données
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Synchronisation des modèles...');
      await sequelize.sync({ alter: true });
      console.log('✅ Modèles synchronisés avec succès');
    }
    
    // Démarrer le serveur
    const server = app.listen(PORT, () => {
      console.log(`🌟 Serveur démarré sur le port ${PORT}`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Info: http://localhost:${PORT}/api`);
    });
    
    // Configuration du timeout pour les requêtes
    server.timeout = 30000; // 30 secondes
    
    // Gestion gracieuse de l'arrêt
    const gracefulShutdown = (signal) => {
      console.log(`\n🛑 Signal ${signal} reçu. Arrêt gracieux du serveur...`);
      
      server.close(async () => {
        console.log('🔌 Fermeture des connexions HTTP...');
        
        try {
          await sequelize.close();
          console.log('🗄️ Connexion à la base de données fermée');
        } catch (error) {
          console.error('❌ Erreur lors de la fermeture de la base de données:', error);
        }
        
        console.log('👋 Serveur arrêté avec succès');
        process.exit(0);
      });
      
      // Forcer l'arrêt après 10 secondes
      setTimeout(() => {
        console.error('⏰ Timeout atteint, arrêt forcé du serveur');
        process.exit(1);
      }, 10000);
    };
    
    // Écouter les signaux d'arrêt
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    return server;
    
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    
    if (error.name === 'SequelizeConnectionError') {
      console.error('🔌 Impossible de se connecter à la base de données');
      console.error('Vérifiez que PostgreSQL est démarré et que les paramètres de connexion sont corrects');
    }
    
    process.exit(1);
  }
}

// Démarrer le serveur si ce fichier est exécuté directement
if (require.main === module) {
  startServer();
}

module.exports = { startServer };