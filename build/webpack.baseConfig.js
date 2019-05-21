const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
	entry: {
    	app: './src/index.js'
	},
	module: {
		rules: [
			{
			    test: /\.js$/,
			    loader: 'babel-loader',
			    exclude: /node_modules/
		 	},
		  	{
			    test: /\.vue$/,
			    loader: 'vue-loader'
		  	},
		  	{
			    test: /\.css$/,
			    use: ['vue-style-loader', 'css-loader']
			},
			{
		        test: /\.scss$/,
		        use: [
		          {
		            loader: "vue-style-loader"
		          },
		          {
		            loader: "css-loader" 
		          },
		          {
		            loader: "sass-loader" 
		          }
		        ]
		      }
		]
	},
	plugins: [
		new VueLoaderPlugin()
	]
}