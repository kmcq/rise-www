import { convertToRaw } from 'draft-js';
import { push } from 'react-router-redux';
import Immutable from 'immutable';

// Firebase is giving Jest a hard time so we'll just stub it in tests
let firebase = {};
let firebaseDb = {};
let firebaseStorage = {};
if (process.env.NODE_ENV !== 'test') {
  firebase = require('firebase'); // eslint-disable-line global-require
  firebaseDb = require('../data/connection').database; // eslint-disable-line global-require
  firebaseStorage = require('../data/connection').storage; // eslint-disable-line global-require
}

// ------------------------------------
// Constants
// ------------------------------------

const SUBSCRIBED = 'Firebase.SUBSCRIBED';
const IS_LOADING = 'Firebase.IS_LOADING';
const SIGN_IN = 'Firebase.SIGN_IN';
const ON_CHANGE = 'Firebase.ON_CHANGE';

// ------------------------------------
// Actions
// ------------------------------------

function isLoading(bool) {
  return {
    type: IS_LOADING,
    payload: bool,
  };
}

function receivedData(dataType, data) {
  return {
    data,
    dataType,
    type: SUBSCRIBED,
  };
}

export function fetchData(dataType, options = {}) {
  return (dispatch) => {
    dispatch(isLoading(true));
    let ref = firebaseDb.ref(dataType);
    if (options.limit) {
      ref = ref.limitToLast(options.limit);
    }
    if (['media/image', 'media/PDF'].indexOf(dataType) >= 0) {
      ref.on('value', (snapshot) => {
        dispatch(receivedData(dataType, snapshot.val()));
      });
    } else {
      ref.once('value').then((snapshot) => {
        dispatch(receivedData(dataType, snapshot.val()));
      });
    }
  };
}

export function signInByEmailPassword(email, password) {
  return (dispatch) => {
    dispatch(isLoading(true));
    firebase.auth().signInWithEmailAndPassword(email, password).catch(() => {
      // Handle Errors here.
    });
  };
}

function signInUser(user) {
  return {
    user,
    type: SIGN_IN,
  };
}

export function createAuthListener(store) {
  store.dispatch(isLoading(true));
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      store.dispatch(signInUser(user));
    } else {
      store.dispatch(isLoading(false));
    }
  });
}

export function dataAt(state, key) {
  const accessPoint = state.firebase[key];
  const data = accessPoint && accessPoint.data;
  return Immutable.OrderedMap(data || {});
}

export function sortByOrder(list) {
  return list.sort((a, b) => a.order > b.order);
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

function addMedia(type, file) {
  firebaseDb.ref(`media/${type}`).push(file);
}

export function writePost(databaseAccessPoint, postData) {
  return (dispatch, getState) => {
    const post = { ...postData };
    post.editorState = convertToRaw(post.editorState.getCurrentContent());
    post.editing = false;
    firebaseDb.ref(`${databaseAccessPoint}/${post.slug}`).set(post);
  };
}

export function onChange(accessPoint, post, oldSlug) {
  const newPost = { ...post, slug: slugify(post.title) };
  const siteSection = accessPoint.replace('posts/', '');
  return (dispatch) => {
    dispatch(push(`/${siteSection}/${newPost.slug}`));
    dispatch({
      accessPoint,
      oldSlug,
      post: newPost,
      type: ON_CHANGE,
    });
  }
}

export function uploadFile(fileType, file) {
  return (dispatch) => {
    const uploadTask = firebaseStorage.ref(fileType).child(file.name).put(file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot){
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    }, function(error) {
      // Handle unsuccessful uploads
    }, function() {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      const url = uploadTask.snapshot.downloadURL;
      addMedia(fileType, { name: file.name, url });
    });
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
function subscribedActionHandler(state, action) {
  return {
    ...state,
    loading: false,
    [action.dataType]: {
      data: action.data,
      hasReceivedData: true,
    },
  };
}

function loadingActionHandler(state, action) {
  return {
    ...state,
    loading: action.payload,
  };
}

function signInActionHandler(state, action) {
  return {
    ...state,
    loading: false,
    currentUser: action.user,
  };
}

function onChangeActionHandler(state, action) {
  const nextState = { ...state };
  if (!nextState[action.accessPoint] || !nextState[action.accessPoint].data) {
    nextState[action.accessPoint] = nextState[action.accessPoint] || {};
    nextState[action.accessPoint].data = {}
  }
  delete nextState[action.accessPoint].data[action.oldSlug];
  nextState[action.accessPoint].data[action.post.slug] = action.post;
  return nextState;
}

const ACTION_HANDLERS = {
  [SUBSCRIBED]: subscribedActionHandler,
  [IS_LOADING]: loadingActionHandler,
  [SIGN_IN]: signInActionHandler,
  [ON_CHANGE]: onChangeActionHandler
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};
export default function firebaseReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
