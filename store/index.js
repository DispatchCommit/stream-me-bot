const cookieparser = process.server ? require('cookieparser') : undefined;

export const state = () => ({

    TITLE: 'STREAM TITLE',
    USER: null,

    auth: null,
    user: null,

});

export const getters = {

    isAuth : state => {
        return !!state.auth;
    },

};

export const mutations = {

    setAuth(state, auth) {
        state.auth = auth
    },

    setUser(state, user) {
        state.user = user;
    },

};

export const actions = {

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

    /*login({ commit }, { req }) {
        const token = await user.getIdToken();
        const uid = user.uid;

        const auth = {
            accessToken: token,
            uid: uid,
        };

        this.$store.commit('setAuth', auth);
        Cookie.set('auth', auth);
    },

    logout({ commit }, { req }) {

    },*/

};
