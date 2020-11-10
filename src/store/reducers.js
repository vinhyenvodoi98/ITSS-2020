import * as actions from './actions';

const initialState = {
  photos: []
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_PICTURES:
      return {
        ...state,
        photos: action.photos
      };
    default:
      return state;
  }
};
export default rootReducer;
