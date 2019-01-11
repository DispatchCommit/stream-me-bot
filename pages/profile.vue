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
                    <v-icon class="mr-2" large="large">https</v-icon> My Profile
                </div>

                <v-card
                    class="mb-3"
                    light="light"
                >
                    <v-card-text>
                        <div class="subheading">
                            <div>Modify your account</div>
                        </div>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer/>
                        <v-btn
                            color="primary"
                            flat
                            nuxt
                            @click="logout"
                        >Logout</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>



        <v-snackbar
            v-model="showError"
            :timeout="5000"
            color="error"
            bottom
        >
            {{ error.message }}
            <v-btn
                dark
                flat
                @click="showError = false"
            >
                Close
            </v-btn>
        </v-snackbar>

        <v-snackbar
            v-model="showSuccess"
            :timeout="5000"
            color="success"
            bottom
        >
            {{ success.message }}
            <v-btn
                dark
                flat
                @click="showSuccess = false"
            >
                Close
            </v-btn>
        </v-snackbar>

    </v-container>
</template>

<script>
    import { auth } from '@/plugins/firebase.js'

    export default {
        name: 'profile',

        middleware: 'auth',

        data() {
            return {
                showError: false,
                error: {
                    message: '',
                },

                showSuccess: false,
                success: {
                    message: '',
                }
            }
        },

        methods: {
            async logout() {
                await auth.signOut();
            },
            
            showErrorToast(message) {
                this.showError = true;
                this.error.message = message;
            },

            showSuccessToast(message) {
                this.showSuccess = true;
                this.success.message = message;
            },

            authenticated(user) {
                if (user) {
                    console.log(`Default: Logged in: ${user.email}`);
                    console.log(user);
                    this.showSuccessToast(`Logged in!`);

                    this.$store.dispatch('saveUser', user.toJSON() );

                } else {
                    this.showErrorToast(`Logged out!`);
                    this.$router.push('/login');
                }
            },
        },

        computed: {},

        created() {
            auth.onAuthStateChanged( user => this.authenticated(user) );
        },
    }
</script>

<style lang='css'>

</style>
