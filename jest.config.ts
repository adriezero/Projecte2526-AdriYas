import type { Config } from 'jest';

const config: Config = {
  projects: [
    {
      displayName: 'api',
      testEnvironment: 'node',
      testMatch: ['**/__tests__/api/**/*.test.ts'],
      transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { module: 'commonjs' } }] },
      moduleNameMapper: {
        '^@lib/(.*)$': '<rootDir>/lib/$1',
        '^@generated/prisma$': '<rootDir>/app/generated/prisma',
        '^@/(.*)$': '<rootDir>/$1',
        '^next-auth$': '<rootDir>/__mocks__/next-auth/index.ts',
      },
    },
    {
      displayName: 'hooks',
      testEnvironment: 'jsdom',
      testMatch: ['**/__tests__/hooks/**/*.test.ts', '**/__tests__/hooks/**/*.test.tsx'],
      transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { module: 'commonjs', jsx: 'react-jsx' } }] },
      moduleNameMapper: {
        '^@lib/(.*)$': '<rootDir>/lib/$1',
        '^@/(.*)$': '<rootDir>/$1',
        '^next/navigation$': '<rootDir>/__mocks__/next/navigation.ts',
        '^next-auth/react$': '<rootDir>/__mocks__/next-auth/react.ts',
      },
      setupFilesAfterEnv: ['@testing-library/jest-dom'],
    },
    {
      displayName: 'lib',
      testEnvironment: 'node',
      testMatch: ['**/__tests__/lib/**/*.test.ts'],
      transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { module: 'commonjs' } }] },
      moduleNameMapper: {
        '^@lib/(.*)$': '<rootDir>/lib/$1',
        '^@/(.*)$': '<rootDir>/$1',
        '^@generated/prisma$': '<rootDir>/app/generated/prisma',
      },
    },
  ],
};

export default config;
