import path from 'node:path';
import { Configuration } from 'webpack';

const isProduction = process.env.NODE_ENV === 'production';

const config: Configuration = {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.ts',
    target: 'node',
    module: {
        rules: [
        {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: isProduction ? {
        minimize: true,
    } : {},
};

export default config;