/**
 * WordPress Webpack Config
 */
const path = require("path");
require("dotenv").config();

module.exports = {
	entry: {
		scripts: [path.resolve(__dirname, "src/scripts.js")],
	},
	output: {
		path: path.resolve(__dirname, "build"),
		filename: "[name].js",
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [["@babel/preset-env", { targets: "defaults" }]],
					},
				},
			},
		],
	},
};
