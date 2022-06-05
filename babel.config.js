// eslint-disable-next-line
const path = require('path');

module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          node: true,
        }
      }
    ]
  ],
  plugins: [
    path.join(__dirname, './babel-plugin-alias.js'),
  ]
}
