import { routerRedux } from 'dva/router';
import { fakeAccountLogin, fakeMobileLogin,logout } from '../services/login';
import {removeLoginStorage} from './../utils/utils'
export default {
  namespace: 'login',

  state: {
    username:'',
    token:'',
    permissions:[],
    status: undefined,
  },

  effects: {
    *checkLoginState({payload},{call,put}){
      const username = localStorage.getItem('username') || sessionStorage.getItem('username');
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const permissions = JSON.parse(localStorage.getItem('permissions')) || JSON.parse( sessionStorage.getItem('permissions'));
      if (username&&token) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            username,
            token,
            permissions
          },
        });
      }else{
        yield put(routerRedux.replace('/login'));
      }
    },
    *accountSubmit({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      console.log(response)
      if(response.status===200){
        sessionStorage.setItem('username', response.data.username);
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('permissions', JSON.stringify(response.data.permissions.data));
        sessionStorage.setItem('role_display_name', response.data.role_display_name);
        if (payload.remember) {
          localStorage.setItem('username', response.data.username);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('permissions', JSON.stringify(response.data.permissions.data));
          sessionStorage.setItem('role_display_name', response.data.role_display_name);

        }
        yield put({
          type: 'changeLoginStatus',
          payload: {
            username:response.data.username,
            token:response.data.token,
            permissions:response.data.permissions.data,
            status:true
          },
        });
        yield put(routerRedux.push('/'));
      }


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
        permissions:payload.permissions,
        status: payload.status,
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
