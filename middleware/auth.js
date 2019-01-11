

export default function ({redirect, store}) {
    console.log('checking middleware');

    /*if (process.server) return;

    if (!store.getters['isAuth']) {
        console.log('Not authenticated! Redirecting...');
        return redirect('/login');
    }*/

    // if(!isAuth(store)) {
    //     return redirect('/login');
    // }

    if (!store.state.auth) {
        return redirect('/login');
    }
}

/*function isAuth(store) {
    return !!store.getters['isAuth'];
}*/
