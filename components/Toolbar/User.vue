<template>
    <div>
        <v-btn
            v-if="isAuth"
            color=""
            flat
            nuxt
            to="/profile"
        >{{ !!user ? user.name : '...' }}</v-btn>
        <v-btn
            v-else
            color=""
            flat
            nuxt
            to="/login"
        >Log In</v-btn>
    </div>
</template>

<script>
    import { auth, db } from '@/plugins/firebase.js'

    export default {
        name: 'User',

        data() {
            return {
                unsubscribeUser: null,
            }
        },

        methods: {
            subscribeToUser(uid) {
                const userdocRef = db.collection('users').doc(uid);
                this.unsubscribeUser = userdocRef.onSnapshot( doc => {
                    this.$store.commit('setUser', doc.data());
                });
            },
        },

        computed: {
            isAuth() {
                return this.$store.getters.isAuth;
            },
            user() {
                if (this.$store.state.user) {
                    return this.$store.state.user;
                } else {
                    return null;
                }
            },
        },

        created() {
            auth.onAuthStateChanged( user => {
                if (user) {
                    this.subscribeToUser(user.uid);
                }
            });
        },

        beforeDestroy() {
            this.unsubscribeUser();
        },
    }
</script>
