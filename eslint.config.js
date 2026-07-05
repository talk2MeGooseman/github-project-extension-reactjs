import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import primerReact from 'eslint-plugin-primer-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'public', 'src/gql.tsx'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat['recommended-latest'],
      jsxA11y.flatConfigs.recommended,
      prettier,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'primer-react': primerReact,
    },
    rules: {
      'primer-react/direct-slot-children': 'error',
      'primer-react/no-deprecated-props': 'warn',
      'primer-react/a11y-explicit-heading': 'error',
      'primer-react/a11y-no-title-usage': 'error',
      'primer-react/a11y-no-duplicate-form-labels': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['codegen.ts', 'vite.config.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
)
