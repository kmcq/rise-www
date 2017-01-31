import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyBC4JnAklDwcDv6c9tHk8b68n7_wCr0HlY',
  authDomain: 'rise-www.firebaseapp.com',
  databaseURL: 'https://rise-www.firebaseio.com',
  storageBucket: 'rise-www.appspot.com'
};

firebase.initializeApp(config);

export const database = firebase.database();
export const storage = firebase.storage();
