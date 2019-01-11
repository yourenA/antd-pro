import { query} from '../services/concentrator_maps';

export default {
  namespace: 'concentrator_maps',
  state: {
    data:[],
    loading: true,
    name:''

  },
  effects: {
    *reset({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {data:[], meta: {pagination: {total: 0, per_page: 0}}}
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
  },
};
