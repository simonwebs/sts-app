// @ts-nocheck
import CompressionPlugin from 'compression-webpack-plugin';
import BrotliPlugin from 'brotli-webpack-plugin';

const plugins = [
  new CompressionPlugin({
    algorithm: 'gzip',
    test: /\.(js|css|html|svg)$/,
    threshold: 10240,
    minRatio: 0.8,
  }),
  new BrotliPlugin({
    test: /\.(js|css|html|svg)$/,
    threshold: 10240,
    minRatio: 0.8,
  }),
];

export default {
  // ...rest of your Webpack configuration
  resolve: {
    alias: {
      'meteor/meteor': 'meteor-node-stubs',
      // ...other aliases
    },
  },
  plugins: [
    ...plugins,
    // ...any other existing plugins in your configuration
  ],
};
