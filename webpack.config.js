var webpack = require('webpack');
var path = require('path');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                  fallback: "style-loader",
                  use: "css-loader"
                })
            },{
                test: /\.scss$/,
                use: [{loader: "style-loader"},{loader: "css-loader"},{loader: "sass-loader"}]
            },{
                test: /\.(jpg|jpeg|gif|png)$/,
                loader:'file-loader?limit=1024&name=images/[hash].[ext]'
            },{
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'file-loader?limit=1024&name=fonts/[hash].[ext]'
            },{ test: /\.json$/, loader: 'json-loader' }
        ]
    },
    node : {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        bufferutil : 'empty'
    },
    context: __dirname + '/app',
    entry: {
        app: './app',
        home : path.join(__dirname, 'app/home'),
        vendor: ['jquery', 'tether', 'bootstrap', 'moment', 'angular', 'angular-resource', 
        'angular-route', 'angular-animate', 'oclazyload', 'angular-strap', 'angular-moment']  
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({name : "vendor", filename : "vendor.bundle.js"}),
        new webpack.ProvidePlugin({ 
            $: "jquery",
            jQuery: "jquery",
            Tether : "tether"
        }),
        new ngAnnotatePlugin({
            add: true,
            // other ng-annotate options here
        }),
        new ExtractTextPlugin({filename: '[name].bundle.css', disable: false, allChunks: true}),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: {removeAll: true } },
            canPrint: true
        })
    ]
};