import { query,add,remove,edit,editConfig } from '../services/concentrators';

export default {
  namespace: 'concentrators',
  state: {
    data:[],
    meta: {pagination: {total: 0, per_page: 0}},
    loading: true,
    name:''
  },
  effects: {
    *reset({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          data:[],
          meta: {pagination: {total: 0, per_page: 0}}
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
      if(response.status===200){
        if(response.data.meta){
          yield put({
            type: 'save',
            payload:  response.data
          });
          yield put({
            type: 'changeLoading',
            payload: false,
          });
        }else{
          yield put({
            type: 'save',
            payload:  {
              data:response.data.data,
              meta: {pagination: {total: 0, per_page: 0}},
            }
          });
          yield put({
            type: 'changeLoading',
            payload: false,
          });
        }
      }

    },
    *add({ payload, callback,errorCallback }, { call, put }) {
      const response = yield call(add, payload);
      console.log(response)
      if(response.status===200){
        if (callback) callback();
      }else{
        if (errorCallback) errorCallback();
      }
    },
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(edit, payload);
      console.log(response)
      if(response.status===200){
        if (callback) callback();
      }
    },
    *editConfig({ payload, callback }, { call, put }) {
      const response = yield call(editConfig, payload);
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
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveName(state,action){
      return {
        ...state,
        name: action.payload,
      };
    }
  },
};
