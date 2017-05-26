var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var glob = require('glob');

var env = process.env.NODE_ENV || 'production';

var config = {};

var output = env === 'production' ? {
	path: path.resolve(__dirname, 'dist'),
	publicPath: '/', 
	filename: 'js/[name].[chunkhash:5].js'
} : {
	path: path.resolve(__dirname, 'debug'),
	publicPath: '/', 
	filename: 'js/[name].js'
};

var extractCss = env === 'production' ? new ExtractTextPlugin('css/[name].[chunkhash:5].css') : new ExtractTextPlugin('css/[name].css');
var commonsJs = env === 'production' ? new webpack.optimize.CommonsChunkPlugin({
	name: 'vendor', 
	filename: 'js/vendor.[chunkhash:5].js'
}) : new webpack.optimize.CommonsChunkPlugin({
	name: 'vendor', 
	filename: 'js/vendor.js'
});

var hotModule = new webpack.HotModuleReplacementPlugin();
var uglifyJs = new webpack.optimize.UglifyJsPlugin({
	beautify: false,
	comments: false,
	compress: {
		warnings: false,
		// 删除console
		drop_console: true
	}
});

var devServer = env === 'production' ? {} : {
	contentBase: path.resolve(__dirname),
	compress: true,
	historyApiFallback: true,
	hot: true,
	inline: true,
	host: 'localhost', 
	port: 8080
};
// 入口文件
var entries = (function() {
	var jsDir = path.resolve(__dirname, 'src/static/js/services');
	var entryFiles = glob.sync(jsDir + '/*.js');
	var map = {};

	entryFiles.forEach(function(filePath) {
		var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
		map[filename] = filePath;
	});
	return map;
})();

var htmlPages = (function() {
	var artDir = path.resolve(__dirname, 'src/views');
	var artFiles = glob.sync(artDir + '/*.art');
	var array = [];

	artFiles.forEach(function(filePath) {
		var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));

		array.push(new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/template/index.html'),
			filename: filename + '.html',
			chunks: ['vendor', 'main', filename],
			chunksSortMode: function(chunk1, chunk2) {
				var order =  ['vendor', 'main', filename];
				var order1 = order.indexOf(chunk1.names[0]);
				var order2 = order.indexOf(chunk2.names[0]);
				return order1 - order2;
			},
			minify: {
				removeComments: env === 'production' ? true : false,
				collapseWhitespace: env === 'production' ? true : false
			}
		}));
	});
	return array;
})();

config = {
	entry: Object.assign(entries, {
			main: path.resolve(__dirname, 'src/main.js'),
			vendor: ['jquery']
		}),
	output: output,
	devServer: devServer,
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader']
			},
			{ 
				test: /\.css$/, 
				use: ['style-loader', 'css-loader'],
				use: ExtractTextPlugin.extract({
					use: [{
						loader: 'css-loader',
						options: {
							minimize: env === 'production' ? true : false
						}
					}]
				})
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: ['url-loader?limit=8192&name=img/[name].[hash:16].[ext]']
			},
			{
				test: /\.(eot|woff|ttf)$/,
				use: ['url-loader?limit=8192&name=font/[name].[hash:16].[ext]']
			},
			{ 
				test: /\.js$/, 
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['es2015'],
						plugins: ['transform-runtime']
					}
				}, 
				exclude: /node_modules/
			},
			{ 
				test: /\.(html|tpl)$/, 
				use: ['html-loader'] 
			},
			{ 
				test: /\.art$/, 
				use: ['art-template-loader'] 
			}
		]
	},
	resolve: {
		// require时省略的扩展名，如：require('module') 不需要module.js
		extensions: ['.art', '.js', '.css'],
		// 别名，可以直接使用别名来代表设定的路径以及其他
		alias: {
			views: path.resolve(__dirname, './src/views'),
			static: path.resolve(__dirname, './src/static'),
			components: path.resolve(__dirname, './src/components')
		}
	},
	plugins: [
		new webpack.DefinePlugin({
		    'process.env': {
		        NODE_ENV: JSON.stringify(env)
		    }
		}),
		extractCss,
		commonsJs
	].concat(htmlPages)
};

if(env === 'production') {
	config.plugins.unshift(uglifyJs)
} else {
	config.plugins.unshift(hotModule);
}

module.exports = config;