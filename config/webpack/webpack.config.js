const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

module.exports = {
	...defaultConfig,
	entry: {
		main: './src/scripts/index.js',
		blocks: './src/blocks/index.js',
		styles: './src/styles.scss',
		'editor-styles': './src/editor-styles.scss',
	},
	output: {
		path: path.resolve(__dirname, '../../dist'),
		filename: '[name].js',
		chunkFilename: '[name].js',
		clean: true,
	},
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
			},
		],
	},
	plugins: [
		...defaultConfig.plugins,
		new RemoveEmptyScriptsPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
	],
	optimization: {
		...defaultConfig.optimization,
		removeEmptyChunks: true,
		splitChunks: false,
	},
};
