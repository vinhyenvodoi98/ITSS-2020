import firebase from 'firebase/app';
import '@firebase/auth';
import '@firebase/firestore';
import 'firebase/analytics';
import 'firebase/storage';
import { firebaseConfig } from 'firebasekey';

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
export const db = firebase.app().firestore();

// -------------select firestore----------
export var selectDB = async (collection, doc) => {
  var docs = await db.collection(collection).doc(doc).get();
  if (docs.exists) {
    // console.log('Document data:', docs.data());
    return docs.data();
  } else {
    console.log('not found');
    return '';
  }
};

// -------------insert firestore----------
export const insertDB = (collection, doc, data) => {
  db.collection(collection)
    .doc(doc)
    .set(data)
    .then(function () {
      console.log('Document successfully written!');
      // message.success('Upload successfully');
    })
    .catch(function (error) {
      console.error('Error adding document: ', error);
      // message.error('Upload failed');
    });
};

// -------------update firestore----------
export const updateDB = (collection, doc, data) => {
  db.collection(collection)
    .doc(doc)
    .update(data)
    .then(function () {
      console.log('Document successfully written!');
      // message.success('Upload successfully');
    })
    .catch(function (error) {
      console.error('Error adding document: ', error);
      // message.error('Upload failed');
    });
};

// -------------Google----------------
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

// -------------Facebook----------------
const providerFacebook = new firebase.auth.FacebookAuthProvider();
providerFacebook.setCustomParameters({ prompt: 'select_account' });
export const signInWithFacebook = () => auth.signInWithPopup(providerFacebook);

// -------------Twitter----------------
const providerTwitter = new firebase.auth.TwitterAuthProvider();
providerTwitter.setCustomParameters({ prompt: 'select_account' });
export const signInWithTwitter = () => auth.signInWithPopup(providerTwitter);

export const signOut = () =>
  auth.signOut().then(() => {
    console.log('signout');
  });

export const storage = firebase.storage();

export default firebase;
