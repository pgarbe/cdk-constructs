module.exports = {
  preset: 'ts-jest',
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx)$",
  testPathIgnorePatterns: [".d.ts"],
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/*.ts',
    '!packages/**/*.d.ts',
    '!**/node_modules/**',
  ],
  roots: [
    'packages/',
  ],
};