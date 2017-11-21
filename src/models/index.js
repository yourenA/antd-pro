// Use require.context to require reducers automatically
// Ref: https://webpack.github.io/docs/context.html
const context = require.context('./', false, /\.js$/);//获取当前目录下的全部js文件
const keys = context.keys().filter(item => item !== './index.js');

const models = [];
for (let i = 0; i < keys.length; i += 1) {
  models.push(context(keys[i]));
}
export default models;
