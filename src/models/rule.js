import { query,add,remove,edit,queryOneRule,editStatus } from '../services/rule';

export default {
  namespace: 'rule',
  state: {
    data:[],
    meta: {pagination: {total: 0, per_page: 0}},
    loading: true,
    editRecord:{}
  },
  effects: {
    *reset({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload:  {
          data:[],
          meta: {pagination: {total: 0, per_page: 0}},
        }
      });
    },
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(query, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload:  response.data
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchOneRule({ payload ,callback}, { call, put }) {
      const response = yield call(queryOneRule, payload);
      console.log(response)
      yield put({
        type: 'saveOneRule',
        payload:  response.data
      });
      if(response.status===200){
        if (callback) callback();
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload.data);
      console.log(response)
      if(response.status===200){
        if (callback) callback(response.data);
      }
    },
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(edit, payload.data);
      console.log(response)
      if(response.status===200){
        if (callback) callback();
      }
    },
    *editStatus({ payload, callback }, { call, put }) {
      const response = yield call(editStatus, payload.data);
      console.log(response)
      if(response.status===200){
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      if(response.status===200){
        if (callback) callback();
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
        meta:action.payload.meta
      };
    },
    saveOneRule(state, action) {
      return {
        ...state,
        editRecord:action.payload
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
