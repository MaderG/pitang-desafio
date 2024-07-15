/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/test/e2e'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test/e2e'
  ],
  
};