import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './test-coverage',
      clean: true,
      exclude: [
        'node_modules/',
        'src/main.js',
      ],
      lines: 80,
      functions: 80,
      branches: 80
    }
  }
})