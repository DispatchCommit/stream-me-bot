<template>
    <v-container
        fill-height
    >
        <v-layout
            align-center
            justify-center
        >
            <v-flex
                style="max-width: 500px"
                class='login-form text-xs-center'
            >
                <div class="display-1 mb-3">
                    <v-icon class="mr-2" large="large">https</v-icon> Logged Out
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { auth } from '@/plugins/firebase.js'

    const Cookie = process.client ? require('js-cookie') : undefined;

    export default {
        name: 'signout',

        data() {
            return {}
        },

        methods: {
            async logout() {
                await auth.signOut();

                // Code will also be required to invalidate the JWT Cookie on external API
                Cookie.remove('auth');
                this.$store.commit('setAuth', null);

                setTimeout(() => this.$router.push('/login'), 250);
            },
        },

        computed: {},

        async created() {
            await this.logout();
        },
    }
</script>
