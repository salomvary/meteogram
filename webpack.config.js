module.exports = {
  entry: './app/main.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.js$/, exclude: /node_modules/,
        // needs coreAliasing for Object.assign
        loader: 'babel-loader?optional=runtime'
      }
    ]
  },
  devtool: '#source-map'
}
