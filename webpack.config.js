const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const resolve = dist => {
    return path.resolve(__dirname, dist)
}

module.exports = (env, argv) => {
    return {
        entry: './src/index.js',
        output: {
            library: 'bkciAtoms',
            libraryTarget: 'umd'
        },
        resolve: {
            extensions: ['.js', '.vue', '.json', '.css', '.scss'],
            alias: {
                'vue': 'vue/dist/vue.esm.js',
                '@': resolve('src')
            }
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    include: resolve('src'),
                    use: 'vue-loader'
                },
                {
                    test: /\.js$/,
                    include: path.resolve('src'),
                    use: [
                        {
                            loader: 'babel-loader'
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    loader: ['style-loader', 'css-loader']
                },
                {
                    test: /.scss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
                {
                    test: /\.(png|jpe?g|gif|svg|cur)(\?.*)?$/,
                    loader: 'url-loader'
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader'
                }
            ]
        },
        optimization: {
            splitChunks: {
                minSize: 50000000
            }
        },
        plugins: [
            new VueLoaderPlugin(),
            // brace 优化，只提取需要的语法
            new webpack.ContextReplacementPlugin(/brace\/mode$/, /^\.\/(json|python|sh|text|powershell|batchfile)$/),
            // brace 优化，只提取需要的 theme
            new webpack.ContextReplacementPlugin(/brace\/theme$/, /^\.\/(monokai)$/)
        ]
    }
}
