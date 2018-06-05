import { query,add,remove,edit,queryMeterDataDetail } from '../services/user_command_data';

export default {
  namespace: 'user_command_data',
  state: {
    data:[],
    meta: {pagination: {total: 0, per_page: 0}},
    loading: true,
    name:'',
    command_msg:{},
    dataMeterDetail:[],
    metaMeterDetail: {pagination: {total: 0, per_page: 0}},
    loadingMeterDetail: true,
  },
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(query, payload);
      console.log(response)
      if(response.status===200){
        yield put({
          type: 'save',
          payload:  response.data
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        if (callback) callback();
      }
    },
    *fetchMeterDetail({ payload,callback }, { call, put }) {
      yield put({
        type: 'changeLoadingMeterDetail',
        payload: true,
      });
      const response = yield call(queryMeterDataDetail, payload);
      console.log(response)
      if(response.status===200){
        yield put({
          type: 'saveMeterDetail',
          payload:  response.data
        });
        yield put({
          type: 'changeLoadingMeterDetail',
          payload: false,
        });
        if (callback) callback();
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      console.log(response)
      if(response.status===200){
        yield put({
          type: 'changeCommandMsg',
          payload: response.data,
        });
        if (callback) callback();
      }
    },
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(edit, payload);
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
    saveMeterDetail(state, action) {
      return {
        ...state,
        dataMeterDetail: action.payload.data,
        metaMeterDetail:action.payload.meta
      };
    },
    changeCommandMsg(state, action) {
      return {
        ...state,
        command_msg: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeLoadingMeterDetail(state, action) {
      return {
        ...state,
        loadingMeterDetail: action.payload,
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
