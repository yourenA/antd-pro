import { queryNotices } from '../services/api';

export default {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    fetchingNotices: false,
    isMobile:document.documentElement.clientWidth<=767?true:false
  },

  effects: {
    *SetMobile({ payload }, { put, select }) {
        yield put({
          type: 'changeView',
          payload: payload<=767
        });

    },
    *fetchNotices(_, { call, put }) {
      yield put({
        type: 'changeNoticeLoading',
        payload: true,
      });
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({//清空某类型
        type: 'saveClearedNotices',
        payload,
      }); //改变notices的个数
      const count = yield select(state => state.global.notices.length);//获取notices的个数
      console.log('count',count)
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });

    },
  },

  reducers: {
    /**
     * this.props.dispatch({
     *   type: 'global/changeLayoutCollapsed',
     *   payload: collapsed,
     * });
     * */
    changeView(state, {  payload }) {
      return {
        ...state,
        isMobile: payload,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
        fetchingNotices: false,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    changeNoticeLoading(state, { payload }) {
      return {
        ...state,
        fetchingNotices: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
