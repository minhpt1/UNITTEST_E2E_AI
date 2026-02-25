import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: ['client/**/*', 'node_modules/**/*'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'node_modules/',
        'dist/',
        'client/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/vitest.config.*',
        'start-blog.*',
        'START.md',
        'README.md',
        'src/index.ts' // Exclude main server file from coverage requirements
      ],
      thresholds: {
        global: {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': './src'
    }
  }
});