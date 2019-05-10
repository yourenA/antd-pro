import { query,showDetail } from '../services/big_meters';

export default {
  namespace: 'big_meters',
  state: {
    data:[],
    meta: {pagination: {total: 0, per_page: 0}},
    loading: true,
    name:''

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
        if(response.data.meta){
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
        }else{
          yield put({
            type: 'save',
            payload:  {
              data:response.data.data,
              meta: {pagination: {total: 0, per_page: 0}},
            }
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
        }
        if(callback) callback()
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
    *showDetail({ payload, callback }, { call, put }) {
      const response = yield call(showDetail, payload);
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
      // console.log('[...state.data,...action.payload.data]',[...state.data,...action.payload.data]);
      const data=[...state.data,...action.payload.data];
      // data.map((item,index)=>{
      //   item.index=index
      // })
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
