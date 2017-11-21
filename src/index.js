import dva from 'dva';
import 'moment/locale/zh-cn';
import models from './models';
import './polyfill';
// import './g2';
// import { browserHistory } from 'dva/router';
import './index.less';

// 1. Initialize
const app = dva({
  // history: browserHistory,
});

// 2. Plugins
// app.use({});

// 3. Model move to router

models.forEach((m) => {
  app.model(m);
});

// 4. Router
app.router(require('./router'));//会注入{history,app}参数

// 5. Start
app.start('#root');
//如果不使用selector。例子如下使用IntlProvider国际化方案包裹
//const App = app.start();
//ReactDOM.render(<IntlProvider><App /></IntlProvider>, htmlElement);
