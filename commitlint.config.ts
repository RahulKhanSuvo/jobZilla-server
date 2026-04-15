export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',
                'fix',
                'docs',
                'style',
                'refactor',
                'perf',
                'test',
                'build',
                'ci',
                'chore',
                'revert',
                'wip',
                'release',
            ],
        ],

        // ✅ allow max 200 chars
        'header-max-length': [2, 'always', 200],

        // ✅ allow any case (upper/lower/mixed)
        'header-case': [0],
        'subject-case': [0],
        'type-case': [0],
    },
};