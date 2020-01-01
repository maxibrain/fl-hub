const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: { background: 'src/background.ts', content: 'src/content.ts', 'flhub-content': 'src/flhub-content.ts' },
  plugins: [
    new CopyPlugin([
      'node_modules/jquery-slim/dist/jquery.slim.min.js',
    ]),
  ],
};
