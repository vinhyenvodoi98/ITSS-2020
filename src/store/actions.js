import { db, selectDB, searchDB } from 'firebaseConfig';

export const GET_PICTURES = 'GET_PICTURES';
export const getPictures = () => async (dispatch) => {
  var photos = [];
  await db
    .collection('pictures')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        data.id = doc.id;
        photos.push(data);
      });
    });
  dispatch({
    type: GET_PICTURES,
    photos
  });
};

export const GET_SEARCH = 'GET_SEARCH';
export const getSearch = () => async (dispatch) => {
  var docs = await selectDB('label', 'label');
  dispatch({
    type: GET_SEARCH,
    search: docs.label
  });
};

export const searchPictures = (label) => async (dispatch) => {
  var photos = await searchDB('pictures', label);

  dispatch({
    type: GET_PICTURES,
    photos
  });
};

export const SET_CURRENTSEARCH = 'SET_CURRENTSEARCH';
export const setCurrentSearch = (currentSearch) => async (dispatch) => {
  dispatch({
    type: SET_CURRENTSEARCH,
    currentSearch
  });
};

export const SET_CURRENTUSER = 'SET_CURRENTUSER';
export const setCurrentUsers = (currentUser) => async (dispatch) => {
  dispatch({
    type: SET_CURRENTUSER,
    currentUser
  });
};
