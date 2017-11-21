import { routerRedux } from 'dva/router';
import { fakeAccountLogin, fakeMobileLogin,logout } from '../services/login';
import {removeLoginStorage} from './../utils/utils'
export default {
  namespace: 'login',

  state: {
    username:'',
    token:''
  },

  effects: {
    *checkLoginState({payload},{call,put}){
      const username = localStorage.getItem('username') || sessionStorage.getItem('username');
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (username&&token) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            username,
            token
          },
        });
      }else{
        yield put(routerRedux.replace('/login'));
      }
    },
    *accountSubmit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeAccountLogin, payload);
      console.log(response)
      sessionStorage.setItem('username', response.data.username);
      sessionStorage.setItem('token', response.data.token);
      if (payload.remember) {
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('token', response.data.token);
      }
      yield put({
        type: 'changeLoginStatus',
        payload: {
          username:response.data.username,
          token:response.data.token
        },
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
      yield put(routerRedux.push('/'));
    },
    *mobileSubmit(_, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeMobileLogin);
      yield put({
        type: 'changeLoginStatus',
        payload: response.data,
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    *logout(_, { call,put }) {
      const response = yield call(logout);
      console.log(response);
      removeLoginStorage()
      yield put(routerRedux.push('/login'));
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        username: payload.username,
        token: payload.token,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
