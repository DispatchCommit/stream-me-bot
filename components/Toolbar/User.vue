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
            /*async getProfile(uid) {
                const docRef = db.collection('users').doc(uid);
                try {
                    const doc = await docRef.get();
                    if (doc.exists) {
                        const data = doc.data();
                        console.log(doc);
                        console.log(data);
                        return data;
                    } else {
                        const data = {
                            uid: uid,
                        };
                        console.log(`%cProfile.vue:%c No user data!`, 'background: #2196f3; color: #fff; border-radius: 3px; padding: .25rem;', '');
                        return data;
                    }
                } catch (e) {
                    console.log(e);
                }
            },*/
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
                if (this.isAuth) {
                    this.unsubscribeUser = db.collection('users').doc(user.uid).onSnapshot( doc => {
                        const data = doc.data();
                        this.$store.commit('setUser', data);
                    });
                } else  {
                    this.unsubscribeUser();
                    this.$store.commit('setUser', null);
                }
            });
        },

        beforeDestroy() {
            this.unsubscribeUser();
        },
    }
</script>
