module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-dnd|@react-dnd|dnd-core|@react-dnd\/html5-backend|@react-dnd\/touch-backend|@react-dnd\/test-backend|@react-dnd\/asap|@react-dnd\/invariant|@react-dnd\/shallowequal|react-dnd-html5-backend)/)'
  ],
}; 