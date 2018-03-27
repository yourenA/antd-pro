import { routerRedux } from 'dva/router';
import { fakeAccountLogin, fakeMobileLogin,logout } from '../services/login';
import {removeLoginStorage} from './../utils/utils'
export default {
  namespace: 'login',

  state: {
    username:'',
    token:'',
    role_display_name:'',
    company_name:'',
    permissions:[],
    status: undefined,
    preUrl:''
  },

  effects: {
    *checkLoginState({payload},{call,put}){
      const username = sessionStorage.getItem('username');
      const token = sessionStorage.getItem('token');
      const role_display_name = sessionStorage.getItem('role_display_name');
      const permissions = JSON.parse( sessionStorage.getItem('permissions'));
      // const company_name = sessionStorage.getItem('company_name')|| localStorage.getItem('company_name');
      // console.log(permissions)
      if (username&&token) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            username,
            token,
            role_display_name,
            permissions,
          },
        });
      }else{

        //存储输入的地址
        yield put({
          type: 'changePreUrl',
          payload:payload,
        });
        yield put(routerRedux.replace('/login'));
      }
    },
    *accountSubmit({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      console.log(response)
      if(response.status===200){
        response.data.permissions.data.push({
          "name": "company_visit",
          "display_name": "机构内容查看",
        })
        sessionStorage.setItem('username', response.data.username);
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('permissions', JSON.stringify(response.data.permissions.data));
        sessionStorage.setItem('role_display_name', response.data.role_display_name);
        // sessionStorage.setItem('company_name', response.data.company_name);
        // localStorage.setItem('company_name', response.data.company_name);
        /*if (payload.remember) {
          localStorage.setItem('username', response.data.username);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('permissions', JSON.stringify(response.data.permissions.data));
          localStorage.setItem('role_display_name', response.data.role_display_name);
          localStorage.setItem('company_name', response.data.company_name);
        }*/
        yield put({
          type: 'changeLoginStatus',
          payload: {
            username:response.data.username,
            token:response.data.token,
            permissions:response.data.permissions.data,
            role_display_name:response.data.role_display_name,
            // company_name:response.data.company_name,
            status:true
          },
        });
        //登陆的时候获取储存的输入地址
        if(payload.preUrl){
          yield put(routerRedux.push(payload.preUrl));

        }else{
          yield put(routerRedux.push('/'));
        }
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
      location.reload();
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
        role_display_name:payload.role_display_name,
        // company_name:payload.company_name
      };
    },
    changePreUrl(state, { payload }) {
      return {
        ...state,
        preUrl: payload,
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
