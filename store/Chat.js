export const Chat = {

    states: {
        TARGET : 'TARGET',
        LOCAL  : 'LOCAL'
    },

    mutations: {
        SET_TARGET : 'SET_TARGET',
        SET_LOCAL  : 'SET_LOCAL,'
    },

    actions: {
        UPDATE_TARGET : 'UPDATE_TARGET',
        UPDATE_LOCAL  : 'UPDATE_LOCAL',
    },

};



export const state = () => ({

    [ Chat.states.TARGET ] : {
        username: '',
        userId: '',
    },

    [ Chat.states.LOCAL ]  : {
        username: '',
        userId: '',
    },

});



export const mutations = {

    [ Chat.mutations.SET_TARGET ] (state, value) {
        state[ Chat.states.TARGET ] = value;
    },

    [ Chat.mutations.SET_LOCAL ] (state, value) {
        state[ Chat.states.LOCAL ] = value;
    },

};



export const actions = {

    [ Chat.actions.UPDATE_TARGET ] ({ commit }, value) {
        commit( Chat.mutations.SET_TARGET, value );
    },

    [ Chat.actions.UPDATE_LOCAL ] ({ commit }, value) {
        commit( Chat.mutations.SET_LOCAL, value );
    },

};
