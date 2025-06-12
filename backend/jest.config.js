module.exports = {
  // Environnement de test
  testEnvironment: 'node',

  // Répertoires de tests
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js',
  ],

  // Fichiers à ignorer
  testPathIgnorePatterns: [
    '/node_modules/',
    '/uploads/',
    '/logs/',
  ],

  // Configuration de la couverture
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/migrations/**',
    '!src/seeders/**',
    '!src/server.js',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Configuration des modules
  moduleFileExtensions: ['js', 'json'],
  moduleDirectories: ['node_modules', 'src'],
  modulePaths: ['<rootDir>/src'],

  // Setup et teardown
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  globalSetup: '<rootDir>/tests/globalSetup.js',
  globalTeardown: '<rootDir>/tests/globalTeardown.js',

  // Timeout
  testTimeout: 30000,

  // Verbose output
  verbose: true,

  // Détection des fichiers ouverts
  detectOpenHandles: true,
  forceExit: true,

  // Transformation des fichiers
  transform: {},

  // Variables d'environnement pour les tests
  setupFiles: ['<rootDir>/tests/env.js'],

  // Reporters personnalisés
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results',
        outputName: 'junit.xml',
        suiteName: 'Ticketing Platform Backend Tests',
      },
    ],
  ],

  // Configuration pour les tests en parallèle
  maxWorkers: '50%',

  // Nettoyage automatique des mocks
  clearMocks: true,
  restoreMocks: true,

  // Gestion des erreurs
  errorOnDeprecated: true,

  // Configuration des mocks
  mockPathIgnorePatterns: ['/node_modules/'],

  // Préprocesseurs
  preprocessorIgnorePatterns: ['/node_modules/'],

  // Configuration des snapshots
  snapshotSerializers: [],

  // Watchman (pour macOS/Linux)
  watchman: true,

  // Patterns pour les fichiers de test
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.js$',

  // Extensions de fichiers à traiter
  moduleFileExtensions: ['js', 'json', 'node'],

  // Configuration pour les tests d'intégration
  projects: [
    {
      displayName: 'Unit Tests',
      testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
    },
    {
      displayName: 'Integration Tests',
      testMatch: ['<rootDir>/tests/integration/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.js'],
    },
  ],
};