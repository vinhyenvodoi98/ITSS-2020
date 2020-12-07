import { db, selectDB } from 'firebaseConfig';

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
  var photos = [];
  // -------------select firestore----------
  await db
    .collection('pictures')
    .where('label', 'array-contains-any', label)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        photos.push(doc.data());
      });
    });
  dispatch({
    type: GET_PICTURES,
    photos
  });
};

export const SET_CURRENTUSER = 'SET_CURRENTUSER';
export const setCurrentUsers = (currentUser) => async (dispatch) => {
  dispatch({
    type: SET_CURRENTUSER,
    currentUser
  });
};
