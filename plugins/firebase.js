import firebase from 'firebase'

import 'firebase/auth'
// import 'firebase/firestore'

if ( !firebase.apps.length )
{
    firebase.initializeApp({
        apiKey: "AIzaSyDvxIMp478PdHkDgWoKVzmhSK2v_xa2Tmo",
        authDomain: "localhost:300",
        projectId: "stream-me-24710",
        messagingSenderId: "820622786644",
        // databaseURL: "xxx",
        // storageBucket: "xxx",
    })
}

// firebase.firestore().settings({ timestampsInSnapshots: true });

// const db = firebase.firestore();
// const storage = firebase.storage(); //if use storage

const auth = firebase.auth();


export {
    // storage,
    // db,

    auth,
}
