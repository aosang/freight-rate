"use strict"
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
	publicPath: './',
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("assets"),
				"@": resolve("common"),
				"@": resolve("static"),
				"@": resolve("components"),
				"@": resolve("views")
				"@": resolve("utils")
      }
    }
  }
}