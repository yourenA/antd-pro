import {query, add, remove, edit} from '../services/leak_abnormality';

export default {
  namespace: 'leak_abnormality',
  state: {
    data: [],
    allData: [],
    meta: {pagination: {total: 0, per_page: 0}},
    loading: true,
    name: ''
  },
  effects: {
    *fetch({payload, callback}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(query, payload);
      console.log(response)
      if(response.status===200){
        yield put({
          type: 'save',
          payload: response.data
        });
        yield put({
          type: 'changeLoading',
          payload: false,

        });
        if (callback)callback()
      }
    },
    *fetchAll({payload, callback}, {call, put}) {
      const response = yield call(query, payload);
      console.log(response)
      if(response.status===200){
        yield put({
          type: 'saveAll',
          payload: response.data
        });
        if (callback)callback()
      }


    },
    *add({payload, callback}, {call, put}) {
      const response = yield call(add, payload);
      console.log(response)
      if (response.status === 200) {
        if (callback) callback();
      }
    },
    *edit({payload, callback}, {call, put}) {
      const response = yield call(edit, payload);
      console.log(response)
      if (response.status === 200) {
        if (callback) callback();
      }
    },
    *remove({payload, callback}, {call, put}) {
      const response = yield call(remove, payload);
      if (response.status === 200) {
        if (callback) callback();
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
        meta: action.payload.meta
      };
    },
    saveAll(state, action) {
      return {
        ...state,
        allData: action.payload.data,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveName(state, action){
      return {
        ...state,
        name: action.payload,
      };
    }
  },
};
