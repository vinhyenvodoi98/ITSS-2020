import * as actions from './actions';

const initialState = {
  photos: [],
  search: [],
  currentUser: null
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_PICTURES:
      return {
        ...state,
        photos: action.photos
      };
    case actions.GET_SEARCH:
      return {
        ...state,
        search: action.search
      };
    case actions.SET_CURRENTUSER:
      return {
        ...state,
        currentUser: action.currentUser
      };
    default:
      return state;
  }
};
export default rootReducer;
