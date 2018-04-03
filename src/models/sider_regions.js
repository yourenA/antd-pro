import { query} from '../services/sider_regions';

export default {
  namespace: 'sider_regions',
  state: {
    data:[],
  },
  effects: {
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
          payload: response.data.data
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        if (callback) callback();
      }
    },
    *concat({payload, callback}, {call, put}) {
      yield put({
        type: 'concat',
        payload: payload
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    concat(state, action) {
      return {
        ...state,
        data: action.payload,
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
