const { defineConfig } = require('@vue/cli-service')
const { DefinePlugin } = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  configureWebpack: {
    plugins: [
      new DefinePlugin({
        'process.env': {
          MY_API_URL: JSON.stringify(process.env.MY_API_URL),
          MY_BASE_URL: JSON.stringify(process.env.MY_BASE_URL),
          MY_STRIPE_KEY: JSON.stringify(process.env.MY_STRIPE_KEY)
        }
      })
    ]
  }
};