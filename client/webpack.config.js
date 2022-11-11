// @flow

/**
 * Configuration file for webpack.
 *
 * Webpack bundles several JavaScript files into a single file
 * for easier script embedding in an index.html file.
 */

const path = require('path');
var webpack = require('webpack');

process.env.REACT_APP_API_KEY = 'a7b2c8f9104041eb91db1dfa26cedafd'; //'5c39dc6c79e241b98a16a72d451d56e6'; //'5b7869e75f75481a8f5005bc7bffd3a8'; //`6eb9e61e0bc642e6840888923fdd6d66`;

// const test = require('dotenv').config();
// console.log(test);

module.exports = {
  plugins: [
    //la inn plugins for å håndtere verdier i env filen
    new webpack.DefinePlugin({
      'process.env.REACT_APP_API_KEY': JSON.stringify(process.env.REACT_APP_API_KEY),
    }),
  ],

  entry: './src/index.tsx', // Initial file to bundle
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  output: {
    // Output file: ./public/bundle.js
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  // Makes original source code available to the browser for easier identification of error causes.
  devtool: 'source-map',
  module: {
    rules: [
      {
        // Use babel to parse .tsx files in the src folder
        test: /\.tsx$/,
        include: path.resolve(__dirname, 'src'),
        use: ['babel-loader'],
      },
    ],
  },
};
