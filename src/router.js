import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import { LocaleProvider } from 'antd';//为组件内建文案提供统一的国际化支持。
import zhCN from 'antd/lib/locale-provider/zh_CN';
import en_US from 'antd/lib/locale-provider/en_US';
import BasicLayout from './layouts/BasicLayout';
import UserLayout from './layouts/UserLayout';
import TestLayout from './layouts/TestLayout';
import About from './layouts/About';
import HeaderBodyLayout from './layouts/HeaderBodyLayout';
import Maintain from './routes/Exception/Maintain';
import {inWorking} from './common/config'
import NotFound from './routes/Exception/404';
//LocaleProvider 使用 React 的 context 特性，只需在应用外围包裹一次即可全局生效。

console.log('inWorking',inWorking)
function RouterConfig({ history }) {
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        {
          inWorking?
            <Switch>
              <Route path="/" component={Maintain} />
            </Switch>
            :
            <Switch>
              <Route path="/login" component={UserLayout} />
              <Route path="/about" component={About} />
              {/*<Route path="/:code/test" component={TestLayout} />*/}
              <Route path="/:code/main" component={HeaderBodyLayout} />
              <Route path="/:code/" component={BasicLayout} />
              <Redirect exact from={`/`} to={`/login`}/>
            </Switch>

        }
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;

