module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
      },
    ],
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'cobertura', 'text-summary'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  maxWorkers: '50%', // Use half of available CPU cores for better performance
  testTimeout: 30000, // 30 second timeout for tests
  detectOpenHandles: true, // Help identify unclosed resources
  forceExit: true, // Ensure Jest exits after tests complete
  // TODO: enable later when all the test migrated to Jest + ATL
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: 80
  //   }
  // }
};
