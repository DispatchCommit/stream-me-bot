import { auth } from '@/plugins/firebase.js'

export default context => {
    const { store } = context;

    return new Promise((resolve) => {
        auth.onAuthStateChanged(async user => {
            if (user) {
                console.log('FireAuth: Automatically logged in.');
                const user = await store.dispatch('saveUser', user.toJSON());
                return resolve( user )
            }
            console.log('FireAuth: Not logged in');
            return resolve();
        });
    })
};
