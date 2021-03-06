import * as firebase from 'firebase/app';

import 'firebase/auth'
import 'firebase/firestore'

if ( !firebase.apps.length )
{
    firebase.initializeApp({
        apiKey: "AIzaSyDvxIMp478PdHkDgWoKVzmhSK2v_xa2Tmo",
        authDomain: "localhost:300",
        projectId: "stream-me-24710",
        messagingSenderId: "820622786644",
        // databaseURL: "xxx",
    });
}

const auth = firebase.auth();
const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true,
});


export {
    auth,
    db,
}
