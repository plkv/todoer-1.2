module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-dnd|react-dnd-html5-backend|react-dnd-touch-backend|@react-dnd|dnd-core)/)',
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
}; 