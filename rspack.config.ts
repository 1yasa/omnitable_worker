import { resolve } from 'path'

import { defineConfig } from '@rspack/cli'

import type { SwcLoaderJscConfig } from '@rspack/core'

const { MODE } = process.env
const is_prod = MODE === 'prod'

module.exports = defineConfig({
	entry: './src/index.ts',
	output: {
		publicPath: '',
		clean: is_prod,
		filename: 'index.js',
		library: {
			type: 'module'
		}
	},
	resolve: {
		extensions: ['.js', '.ts', '.tsx'],
		alias: {
			'@server': resolve(`${process.cwd()}/src`),
			'@schema': resolve(`${process.cwd()}/schema/index.ts`)
		}
	},
	devtool: false,
	externals: [{ crypto: 'node:crypto' }, 'node:crypto', 'node:buffer', 'node:async_hooks', 'cloudflare:workers'],
	watchOptions: {
		ignored: /node_modules/
	},
	experiments: {
		outputModule: true
	},
	optimization: {
		minimize: is_prod
		// minimize: false
	},
	ignoreWarnings: [/size limit/, /performance recommendations/],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				type: 'javascript/auto',
				use: {
					loader: 'builtin:swc-loader',
					options: {
						isModule: true,
						jsc: {
							parser: {
								syntax: 'typescript',
								tsx: true,
								dynamicImport: true,
								exportDefaultFrom: true,
								exportNamespaceFrom: true,
								decorators: false
							},
							transform: {
								legacyDecorator: false,
								decoratorMetadata: false,
								react: {
									development: false,
									refresh: false,
									runtime: 'automatic',
									useBuiltins: true
								}
							},
							minify: {
								compress: {
									drop_console: false
								}
							},
							externalHelpers: true
						} as SwcLoaderJscConfig,
						env: {
							targets: 'chrome >= 120'
						}
					}
				}
			}
		]
	}
})
