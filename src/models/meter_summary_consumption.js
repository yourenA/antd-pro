import { query,add,remove,edit } from '../services/meter_summary_consumption';
import sortBy from 'lodash/sortBy'
export default {
  namespace: 'meter_summary_consumption',
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
        payload: []
      });
    },
    *fetch({ payload,callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      console.log('payload',payload)
      const response = yield call(query, payload);
      console.log(response)
      if(response.status===200){
        yield put({
          type: 'save',
          payload:  response.data.data
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        if(document.querySelector('.ant-table-body')){
          document.querySelector('.ant-table-body').scrollTop=0;
        }else{
          console.log('没找到表格')
        }
        if (callback) callback();
      }

    },
    *fetchAndPush({ payload,callback }, { call, put }) {
      // yield put({
      //   type: 'changeLoading',
      //   payload: true,
      // });
      const response = yield call(query, payload);
      console.log(response)
      if(response.status===200){
        yield put({
          type: 'saveAndPush',
          payload:  response.data
        });
        // yield put({
        //   type: 'changeLoading',
        //   payload: false,
        // });
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
      // const data=action.payload.data;
      // data.map((item,index)=>{
      //   item.index=index
      // })
      let data={
        daily_average_items:action.payload.daily_average_items.reverse(),
        meter_average_items:sortBy(action.payload.meter_average_items, function(o) { return -o.value; })
      }

      return {
        ...state,
        data: data,
        // meta:action.payload.meta
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
