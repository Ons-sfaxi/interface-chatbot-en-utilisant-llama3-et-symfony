const Encore = require('@symfony/webpack-encore');

// Configurer l'environnement runtime si ce n'est pas déjà fait
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    // Dossier où les assets compilés seront stockés
    .setOutputPath('public/build/')
    // Chemin public utilisé par le serveur web pour accéder au dossier de sortie
    .setPublicPath('/build')

    // Configurer l'entrée principale
    .addEntry('app', './assets/app.js')

    // Activer l'optimisation du code en divisant les fichiers en plus petits morceaux
    .splitEntryChunks()

    // Activer le runtime chunk pour la gestion des dépendances communes
    .enableSingleRuntimeChunk()

    // Activer les fonctionnalités supplémentaires
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())

    // Configurer Babel pour utiliser les polyfills nécessaires
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = '3.23';
    })

    // Activer le preset React pour Babel
    .enableReactPreset()

    // Activer le support des fichiers SASS/SCSS
    .enableSassLoader()

    // Fournir automatiquement jQuery
    .autoProvidejQuery()
;

module.exports = Encore.getWebpackConfig();
