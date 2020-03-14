import {query, queryHistory,remove} from '../services/manually_monitoring_meter_data';
import {parseHistory,Delayering} from './../utils/utils'
export default {
  namespace: 'manually_monitoring_meter_data',
  state: {
    data: [],
    historyData: [],
    loading: true,
    historyLoading: true,
    name: ''

  },
  effects: {
    *reset({payload}, {call, put}) {
      yield put({
        type: 'save',
        payload: []
      });
    },
    *fetch({payload, callback}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(query, payload);
      console.log(response)
      if (response.status === 200) {
        yield put({
          type: 'save',
          payload: response.data
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        if (document.querySelector('.ant-table-body')) {
          document.querySelector('.ant-table-body').scrollTop = 0;
        } else {
          console.log('没找到表格')
        }
        if (callback) callback();
      }
    },
    *fetchHistory({payload, callback}, {call, put}) {
      yield put({
        type: 'saveHistory',
        payload: []
      });
      yield put({
        type: 'changeHistoryLoading',
        payload: true,
      });
      const response = yield call(queryHistory, payload);
      console.log('response', response)
      if (response.status === 200) {
        // let parseData = parseHistory(response.data);
        // console.log('parseData1', parseData)
        //
        // for (let j = 0; j < parseData.length; j++) {
        //   let children = [];
        //   if( parseData[j].children2){
        //     console.log('parseData[j].children2.length',parseData[j].children2.length)
        //     for (let i = 0; i < parseData[j].children2.length; i++) {
        //       if(parseData[j].children2[i] instanceof  Array){
        //         children=[...children,...parseData[j].children2[i]]
        //
        //       }else{
        //         console.log('是对象')
        //         children=[...children,parseData[j].children2[i]]
        //       }
        //
        //       // parseData[j].children.push(parseData[j].children2[i])
        //     }
        //     parseData[j].children=children
        //   }
        // }
        //
        // console.log('parseData2',parseData)

        yield put({
          type: 'saveHistory',
          payload: Delayering(response.data)
        });
        yield put({
          type: 'changeHistoryLoading',
          payload: false,
        });
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
      return {
        ...state,
        historyLoading: action.payload,
      };
    },
  },
};
