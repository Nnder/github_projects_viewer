module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        // 'plugin:@typescript-eslint/recommended',
        // 'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended-type-checked', // @typescript-eslint @v6
        'plugin:@typescript-eslint/stylistic-type-checked', // @typescript-eslint @v6
        'airbnb',
        'airbnb/hooks',
        'airbnb-typescript',
        'prettier',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.eslint.json',
    },
    plugins: ['react-refresh', '@typescript-eslint'],
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
        'react/react-in-jsx-scope': 'off',
        'react/jsx-props-no-spreading': ['error', { custom: 'ignore' }],
        'unicorn/no-array-for-each': 'off',
        'import/no-extraneous-dependencies': 'off',
        'react/jsx-filename-extension': 'off',
    },
};
