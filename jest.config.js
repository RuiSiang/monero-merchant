module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testRegex: ['.(spec|test).ts$'],
  verbose: true,
  bail: 0,
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  maxConcurrency: 1,
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        filename: 'jest-report.html',
        expand: true,
      },
    ],
  ],
}
