const path = require('path')

module.exports = {
    mode: "development",
    entry: {
        top: "./src/top.tsx",
        table: "./src/table.tsx",
        join: "./src/join.tsx",
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    devServer: {
        contentBase: "dist",
        open: true
    }
}