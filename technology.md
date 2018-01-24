
# Ant Design Pro

>先要全局安装 roadhog 。roadhog让 create-react-app 可配的命令行工具。入口文件是 .roadhogrc

## roadhog

```
$ roadhog server 
$ roadhog build 
```

**.roadhogrc**
```
{
  "entry": "src/index.js",//指定 webpack 入口文件，支持 glob 格式。
  "extraBabelPlugins": [ //配置额外的 babel plugin
    "transform-runtime",
    "transform-decorators-legacy",
    "transform-class-properties",
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }]
  ],
  "env": { //针对特定的环境进行配置。extraBabelPlugins 是 ["transform-runtime", "dva-hmr"]，而生产环境下是 ["transform-runtime"]
    "development": {
      "extraBabelPlugins": [
        "dva-hmr"
      ]
    }
  },
  "externals": { //配置 webpack 的 externals 属性。
    "g2": "G2",
    "g-cloud": "Cloud",
    "g2-plugin-slider": "G2.Plugin.slider"
  },
  "ignoreMomentLocale": true,
  "theme": "./src/theme.js" //配置主题，实际上是配 less 的 modifyVars。支持 Object 和文件路径两种方式的配置。
}
```

## dva
**基于 redux、redux-saga 和 react-router 的轻量级前端框架。里面集成 react-router，react-router-redux 接口**
```
const app = dva(); //初始化
app.use()//配置 hooks 或者注册插件。（插件最终返回的是 hooks ）
app.model()//接受发送的action
app.router()//配置路由
app.start(selector?)
```

### dva/router
```
import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import { LocaleProvider } from 'antd'; //为组件内建文案提供统一的国际化支持。
import zhCN from 'antd/lib/locale-provider/zh_CN';
import BasicLayout from './layouts/BasicLayout';
import UserLayout from './layouts/UserLayout';

function RouterConfig({ history }) {
  return (
    <LocaleProvider locale={zhCN}> //LocaleProvider 使用 React 的 context 特性，只需在应用外围包裹一次即可全局生效。
      <Router history={history}>
        <Switch>
          <Route path="/user" component={UserLayout} />
          <Route path="/" component={BasicLayout} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;

```
### dva/fetch
异步请求库，输出 isomorphic-fetch 的接口。不和 dva 强绑定，可以选择任意的请求库。
```
import fetch from 'dva/fetch';
```

### dva/saga
输出 redux-saga 的接口，主要用于用例的编写。（用例中需要用到 effects）

### dva/dynamic
解决组件动态加载问题的 util 方法，基于 react-async-component 实现。
```
import dynamic from 'dva/dynamic';

const UserPageComponent = dynamic({
  app,
  models: () => [
    import('./models/users'),
  ],
  component: () => import('./routes/UserPage'),
});
```

### model

model/index.js
```
// Use require.context to require reducers automatically
// Ref: https://webpack.github.io/docs/context.html
const context = require.context('./', false, /\.js$/);//获取当前目录下的全部js文件
const keys = context.keys().filter(item => item !== './index.js');

const models = [];
for (let i = 0; i < keys.length; i += 1) {
  models.push(context(keys[i]));
}
export default models;//全部的model

```
* ```context=require.context(directory, useSubdirectories, regExp)``` context.keys()返回路径数组
  - directory：说明需要检索的目录
  - useSubdirectories：是否检索子目录
  - regExp: 匹配文件的正则表达式

**model{} 包含 5 个属性：**
- namespace
  <br/>model 的命名空间，同时也是他在全局 state 上的属性，只能用字符串，不支持通过 . 的方式创建多层命名空间。
  ```namespace: 'list'```
  
- state {}
  <br/>初始值，优先级低于传给 dva() 的 opts.initialState。
  ```
  state: {
      list: [],
      loading: false,
    }
  ```

- reducers{{},{},{}}
  <br/>以 key/value 格式定义 reducer。用于处理同步操作，唯一可以修改 state 的地方。由 action 触发。
  格式为(state, action) => newState 
  ```
   reducers: {
      appendList(state, action) { //state为旧state
        return {
          ...state,
          list: state.list.concat(action.payload),
        };
      },
      changeLoading(state, action) {
        return {
          ...state,
          loading: action.payload,
        };
      },
    },
  ```
  
- effects  {{},{},{}} 来自于redux-saga 
  <br/>以 key/value 格式定义 effect。
  用于处理异步操作和业务逻辑，不直接修改 state。由 action 触发，可以触发 action，可以和服务器交互，可以获取全局 state 的数据等等。
  格式为 *FuncName(action, effects) => void 。
  <br/>(action, effects) ===({ payload }, { call, put，select })
  <br/>call, put来自于redux-saga/effects //import { call, put } from 'redux-saga/effects'
  - call  用于调用异步逻辑，支持 promise 。
  - put   用于触发 action 。
  - select 选择state的某一个对象 yield select(state => state.global.notices.length) 
  
- subscriptions
  <br/>subscription 是订阅，用于订阅一个数据源，然后根据需要 dispatch 相应的 action。


### 使用connect
```
import { connect } from 'dva';

export default connect(state => ({
  currentUser: state.user.currentUser,// 格式 state.namespace.statekey
  collapsed: state.global.collapsed,
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
}))(BasicLayout);
```
