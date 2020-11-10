import { db } from 'firebaseConfig';

export const GET_PICTURES = 'GET_PICTURES';
export const getPictures = () => async (dispatch) => {
  var photos = [];
  await db
    .collection('pictures')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        photos.push(doc.data());
      });
    });
  dispatch({
    type: GET_PICTURES,
    photos
  });
};
