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

// -------------select firestore----------
export var selectPictureFromAuthor = async (collection, uid) => {
  var photos = [];
  await db
    .collection(collection)
    .where(`author.uid`, '==', uid)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        let data = doc.data();
        data.id = doc.id;
        // doc.data() is never undefined for query doc snapshots
        photos.push(data);
      });
    });
  return photos;
};

// -------------search firestore----------
export var searchDB = async (collection, label) => {
  if (label.length > 10) label = label.slice(0, 10);
  var photos = [];
  // -------------select firestore----------
  await db
    .collection(collection)
    .where('label', 'array-contains-any', label)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        let data = doc.data();
        data.id = doc.id;
        // doc.data() is never undefined for query doc snapshots
        photos.push(data);
      });
    });
  return photos;
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

// -------------update comment firestore----------
export const updateComment = (collection, doc, data) => {
  db.collection(collection)
    .doc(doc)
    .update({
      comment: firebase.firestore.FieldValue.arrayUnion(data)
    })
    .then(function () {
      console.log('Document successfully written!');
      // message.success('Upload successfully');
    })
    .catch(function (error) {
      console.error('Error adding document: ', error);
      // message.error('Upload failed');
    });
};

// -------------update comment firestore----------
export const updateAlbums = (collection, doc, data) => {
  db.collection(collection)
    .doc(doc)
    .update({
      albums: firebase.firestore.FieldValue.arrayUnion(data)
    })
    .then(function () {
      console.log('Document successfully written!');
      // message.success('Upload successfully');
    })
    .catch(function (error) {
      console.error('Error adding document: ', error);
      // message.error('Upload failed');
    });
};

// -------------update comment firestore----------
export const updatePhotoAlbums = (collection, doc, data) => {
  console.log(doc, data);
  db.collection(collection)
    .doc(doc)
    .update({
      photo: firebase.firestore.FieldValue.arrayUnion(data)
    })
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
