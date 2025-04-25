module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: [
    '<rootDir>/tests/**/*.(test|spec).(ts|tsx|js)'
  ],
  moduleNameMapper: {
    '^expo-sqlite$': '<rootDir>/__mocks__/expo-sqlite.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|expo|@expo|expo-sqlite|expo-asset|expo-modules-core|@react-native|@react-navigation|@unimodules|unimodules|sentry-expo|native-base|@react-native-community|@react-native-picker|@react-native-masked-view|@react-native-async-storage)/)'
  ],
};
