// https://eslint.org/docs/user-guide/configuring

module.exports = {
	root: true,
	parserOptions: {
		parser: 'babel-eslint'
	},
	env: {
		browser: true,
	},
	extends: [
		// https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
		// consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
		'plugin:vue/essential',
		// https://github.com/standard/standard/blob/master/docs/RULES-en.md
		'standard'
	],
	// required to lint *.vue files
	plugins: [
		'vue'
	],
	// add your custom rules here
	rules: {
		// allow async-await
		'generator-star-spacing': 'off',
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		"no-tabs": "off",
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"never"
		],
		"no-console": [
			"error",
			{
				allow: [
					"warn",
					"error",
					"log"
				]
			}
		],
		'spaced-comment': 1,
		'no-eq-null': 0,
		'no-multiple-empty-lines': 0,
		'object-property-newline': 0,
		'no-unused-vars': 0,
		'no-unused-expressions': 0,
		'no-useless-escape': 0,
		'no-useless-return': 0,
		'space-unary-ops': 0,
		'no-unreachable': 0
	}
}
