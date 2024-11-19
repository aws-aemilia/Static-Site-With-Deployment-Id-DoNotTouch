const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const buildTime = new Date().toLocaleTimeString();
const banner = `Build time: ${buildTime} DeploymentId: ${process.env.AWS_AMPLIFY_DEPLOYMENT_ID}`;

function addBannerToFile(content, path) {
  if (path.endsWith('.css')) {
    return `/* ${banner} */\n${content}`;
  }
  if (path.endsWith('.js')) {
    return `// ${banner}\n${content}`;
  }
  return content;
}

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      buildTime: buildTime,
      deploymentId: process.env.AWS_AMPLIFY_DEPLOYMENT_ID,
      filename: 'index.html',
      buildTimestamp: new Date().toISOString(),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'css',
          to: 'css',
          transform: addBannerToFile,
        },
        {
          from: 'js',
          transform: addBannerToFile,
        },
        { from: 'img', to: 'img' },
        { from: 'icon.svg' },
        { from: 'favicon.ico' },
        { from: 'robots.txt' },
        { from: 'icon.png' },
        { from: '404.html' },
        { from: 'site.webmanifest' },
      ],
    }),
  ],
});
