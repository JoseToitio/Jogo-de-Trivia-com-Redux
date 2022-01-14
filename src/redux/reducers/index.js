import { SET_TOKEN, SET_PLAYER } from '../actions';

const INITIAL_STATE = {
  token: '',
  player: {
    name: '',
    assertions: '',
    score: '0',
    gravatarEmail: '',
  },
};

function triviaReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
  case SET_TOKEN:
    return {
      ...state,
      token: action.token,
    };
  case SET_PLAYER:
    return {
      ...state,
      player: { ...state.player, ...action.player },
    };
  default:
    return state;
  }
}

export default triviaReducer;
