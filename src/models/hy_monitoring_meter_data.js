import { query,queryHistory } from '../services/hy_monitoring_meter_data';
export default {
  namespace: 'hy_monitoring_meter_data',
  state: {
    data:[],
    historyData:[],
    loading: true,
    historyLoading: true,
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
        if(document.querySelector('.ant-table-body')){
          document.querySelector('.ant-table-body').scrollTop=0;
        }else{
          console.log('没找到表格')
        }
        if (callback) callback();
      }
    },
    *fetchHistory({ payload,callback }, { call, put }) {
      yield put({
        type: 'changeHistoryLoading',
        payload: true,
      });
      const response = yield call(queryHistory, payload);
      if(response.status===200){
        yield put({
          type: 'saveHistory',
          payload:  response.data
        });
        yield put({
          type: 'changeHistoryLoading',
          payload: false,
        });
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
      return {
        ...state,
        data: action.payload,
        // meta:action.payload.meta
      };
    },
    saveHistory(state, action) {
      // const data=action.payload.data;
      // data.map((item,index)=>{
      //   item.index=index
      // })
      return {
        ...state,
        historyData: action.payload,
        // meta:action.payload.meta
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeHistoryLoading(state, action) {
      console.log('changeHistoryLoading')
      return {
        ...state,
        historyLoading: action.payload,
      };
    },
  },
};
