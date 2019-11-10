const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const isProd = false;
module.exports = {
    output: {
        path: path.join(process.cwd(), 'dist'),
        filename: '[name].[chunkhash].js',
        crossOriginLoading: false,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.scss$/,
                loader: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'global',
                                localIdentName: isProd
                                    ? '[hash:base64:5]'
                                    : '[path][name]__[local]--[hash:base64:5]',
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                includePaths: ['./node_modules'],
                            }
                        },
                    },
                ],
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css',
        }),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            minify: isProd,
            hash: true,
        })
    ]
};