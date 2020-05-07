import { queryflies } from '@/services/files';

export default {
  namespace: 'filesmodel',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *queryflies({ payload }, { call, put }) {
        const response = yield call(queryflies, payload);
        console.log(response)
        yield put({
            type: 'save',
            payload: response,
        });
      },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
