module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['tsconfig.json'],
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    reportUnusedDisableDirectives: true,
    rules: {
        // temporary ignore unused account variable for the proxy service refactor
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: 'account' }],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': ['error'],
        '@typescript-eslint/no-explicit-any': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': [
            2,
            { builtinGlobals: false, hoist: 'functions', allow: [] },
        ],
        'max-len': [
            'error',
            {
                code: 150,
                ignoreRegExpLiterals: false,
                ignorePattern: '^import.*from.*;$',
                ignoreComments: true,
                ignoreTrailingComments: true,
                ignoreTemplateLiterals: false,
                ignoreStrings: false,
                ignoreUrls: false,
            },
        ],
        '@typescript-eslint/return-await': 'error',
        'no-await-in-loop': 'error',
        'no-restricted-imports': [
            'error',
            {
                patterns: ['.*'],
            },
        ],
    },
    overrides: [],
};
