// import axios from 'axios'
// import { auth } from '@/plugins/firebase.js'

export const state = () => ({

    TITLE: 'STREAM TITLE',
    UID: null,
    USER: null,

});

export const getters = {
    isAuth: state => {
        return !!state.UID && !!state.USER;
    },
};

export const mutations = {

    setUserName (state, value) {
        state.TITLE = value;
    },

    setUser(state, value) {
        state.USER = value;
    },

    setUID (state, value) {
        state.UID = value;
    },

};

export const actions = {
    /*async nuxtServerInit({commit}) {
        const checkAuth = () => {
            return new Promise((resolve) => {
                auth.onAuthStateChanged(user => {
                    if (user) {
                        console.log('ServerInit: Automatically logged in.');
                        return resolve(user.toJSON());
                    }
                    console.log('ServerInit: Not logged in');
                    return resolve();
                });
            });
        };
        const user = await checkAuth();
        if (user) {
            commit('saveUser', user);
            return true;
        } else {
            return false
        }
    },*/

    saveUser ({commit}, value) {
        if (!value) return false;
        commit('setUser', value);
        commit('setUID', value.uid);
        return true;
    },
};
