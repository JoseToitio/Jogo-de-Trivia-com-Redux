import { SET_TOKEN } from '../actions';

const INITIAL_STATE = {
  token: '',
};

function triviaReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
  case SET_TOKEN:
    return {
      ...state,
      token: action.token,
    };
  default:
    return state;
  }
}

export default triviaReducer;
