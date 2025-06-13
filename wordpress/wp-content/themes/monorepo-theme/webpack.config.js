/**
 * WordPress Webpack Config
 */
const path = require('path');
require('dotenv').config();
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

module.exports = {
	entry: {
		scripts: [path.resolve(__dirname, 'src/scripts.js')],
		styles: [path.resolve(__dirname, 'src/styles.scss')],
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[name].js',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
		],
	},
	plugins: [new RemoveEmptyScriptsPlugin(), new MiniCssExtractPlugin({ filename: '[name].css' })],
	optimization: {
		removeEmptyChunks: true,
		splitChunks: false,
	},
};
