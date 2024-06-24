const path = require('path')

const productionGzipExtensions = ['js', 'css']

//这是配置路径引用的，可以不要
// function resolve(dir) {
// 	return path.join(__dirname, dir)
// }

module.exports = {
	// 配置路径别名
	configureWebpack: {
		devServer: {
			disableHostCheck: true,
		},
		module: {
			rules: [
			  {
				test: /\.vue$/,
				use:{
					// loader: "vue-inset-loader"
					// // 针对Hbuilder工具创建的uni-app项目
					loader: path.resolve(__dirname,"./node_modules/vue-inset-loader")
					// // 支持自定义pages.json文件路径
					// options: {
					//     pagesPath: path.resolve(__dirname,'./src/pages.json')
					// }
				}
			  }
			]
		}
	},
	// configureWebpack: {
	//   plugins: [
	//     new CompressionWebpackPlugin({
	//       filename: '[path].gz[query]',
	//       algorithm: 'gzip',
	//       test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'), //匹配文件名
	//       threshold: 102400, //对10K以上的数据进行压缩
	//       minRatio: 0.8,
	//       deleteOriginalAssets: false, //是否删除源文件
	//     }),
	//   ],
	// },
}
