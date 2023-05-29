const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000, //设置启动端口号，防止8080被占用
    proxy: { //模拟跨域请求后端，设置代理
      '/native': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { //路径重写
          '^/native': '' //以/native开头的 重写为''
        }
      }
    },
  },
})
