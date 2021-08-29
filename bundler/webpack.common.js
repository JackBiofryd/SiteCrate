const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
	entry: {
		main: path.resolve(__dirname, '../src/script.js'),
		about: path.resolve(__dirname, '../src/about.js'),
		contact: path.resolve(__dirname, '../src/contact.js')
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '../dist'),
		chunkFilename: '[id].[chunkhash].js',
		publicPath: '/'
	},
	devtool: 'source-map',
	plugins: [
		new CopyWebpackPlugin({
			patterns: [{ from: path.resolve(__dirname, '../static') }]
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../src/index.html'),
			minify: true,
			chunks: ['main']
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../src/about.html'),
			minify: true,
			chunks: ['about'],
			filename: 'about.html'
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../src/contact.html'),
			minify: true,
			chunks: ['contact'],
			filename: 'contact.html'
		}),
		new MiniCSSExtractPlugin()
	],
	module: {
		rules: [
			// HTML
			{
				test: /\.(html)$/,
				use: {
					loader: 'html-loader',
					options: {
						attributes: {
							list: [
								{
									tag: 'img',
									attribute: 'src',
									type: 'src'
								},
								{
									tag: 'img',
									attribute: 'srcset',
									type: 'srcset'
								},
								{
									tag: 'img',
									attribute: 'data-src',
									type: 'src'
								},
								{
									tag: 'img',
									attribute: 'data-srcset',
									type: 'srcset'
								},
								{
									tag: 'video',
									attribute: 'src',
									type: 'src'
								},
								{
									tag: 'source',
									attribute: 'src',
									type: 'src'
								},
								{
									tag: 'source',
									attribute: 'srcset',
									type: 'srcset'
								}
							]
						}
					}
				}
			},

			// JS
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},

			// CSS
			{
				test: /\.css$/,
				use: [MiniCSSExtractPlugin.loader, 'css-loader']
			},

			// Media Files
			{
				test: /\.(jpg|png|gif|svg|mp4|avi|webm)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'assets/media/'
						}
					}
				]
			},

			// Fonts
			{
				test: /\.(ttf|eot|woff|woff2)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'assets/fonts/'
						}
					}
				]
			},

			// Shaders
			{
				test: /\.(glsl|vs|fs|vert|frag)$/,
				exclude: /node_modules/,
				use: ['raw-loader']
			},

			// Urls in files
			{
				test: /\.(png|jpg|svg)$/,
				loader: 'url-loader'
			}
		]
	}
};
