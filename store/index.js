const cookieparser = process.server ? require('cookieparser') : undefined;
// import axios from 'axios'
// import { auth } from '@/plugins/firebase.js'

export const state = () => ({

    TITLE: 'STREAM TITLE',
    USER: null,

    auth: null,

});

export const getters = {
    /*isAuth: state => {
        return !!state.auth;
    },*/
};

export const mutations = {

    setUserName (state, value) {
        state.TITLE = value;
    },

    setUser(state, value) {
        state.USER = value;
    },


    setAuth(state, auth) {
        state.auth = auth
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

    nuxtServerInit({ commit }, { req }) {
        let auth = null;
        if (req.headers.cookie) {
            const parsed = cookieparser.parse(req.headers.cookie);
            try {
                auth = JSON.parse(parsed.auth);
            } catch (err) {
                // No valid cookie found
            }
        }
        commit('setAuth', auth);
    },

};
