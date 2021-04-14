import { query,add,remove,edit,addTask,removeTask } from '../services/workstations2';

export default {
  namespace: 'm1v1',
  state: {
    data:[],
    meta: {pagination: {total: 0, per_page: 0}},
    loading: true,
    name:''

  },
  effects: {
    *reset({ payload }, { call, put }) {
      console.log('m1v1 reset')
      yield put({
        type: 'save',
        payload: {
          data:[],
          meta:{pagination: {total: 0, per_page: 0}}
        }
      });
    },
    *fetch({ payload,callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(query, {...payload,template:51300402,order_direction:'desc'});
      console.log(response)
      if(response.status===200){
        yield put({
          type: 'save',
          payload:  response.data
        });
        if(document.querySelector('.ant-table-body')){
          document.querySelector('.ant-table-body').scrollTop=0;
        }else{
          console.log('没找到表格')
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        if (callback) callback();
      }
    },
    *fetchAndPush({ payload,callback }, { call, put }) {
      const response = yield call(query, payload);
      console.log(response)
      if(response.status===200){
        yield put({
          type: 'saveAndPush',
          payload:  response.data
        });
        if (callback) callback();
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      console.log(response)
      if(response.status===200){
        if (callback) callback();
      }
    },
    *addTask({ payload, callback }, { call, put }) {
      const response = yield call(addTask, payload);
      console.log(response)
      if(response.status===200){
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
    *removeTask({ payload, callback }, { call, put }) {
      const response = yield call(removeTask, payload);
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
    saveAndPush(state, action) {
      const data=[...state.data,...action.payload.data];
      return {
        ...state,
        data: data,
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
