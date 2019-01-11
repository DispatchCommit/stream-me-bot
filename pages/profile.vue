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
                    <v-icon
                        class="mr-2"
                        large="large"
                    >https</v-icon>
                    Profile
                </div>

                <v-card
                    v-if="user"
                    class="mb-3"
                    light="light"
                >
                    <v-card-text>

                        <div class="subheading">
                            <div>View & Modify Account Detials</div>
                        </div>

                        <v-form>

                            <v-text-field
                                v-model="user.displayName"
                                :readonly="!allowEdit"
                                light="light"
                                prepend-icon="person"
                                label="Display Name"
                            />

                            <v-text-field
                                v-model="user.email"
                                :readonly="!allowEdit"
                                light="light"
                                prepend-icon="person"
                                label="Username"
                            />

                        </v-form>

                        <div
                            class="text-xs-left"
                        >
                            <small>UID: {{ user.uid }}</small>
                        </div>

                    </v-card-text>

                    <v-card-actions v-if="user">
                        <v-spacer/>
                        <v-btn
                            color="primary"
                            flat
                            nuxt
                        >Edit</v-btn>
                        <v-btn
                            color="primary"
                            flat
                            nuxt
                            @click="logout"
                        >Logout</v-btn>
                    </v-card-actions>

                </v-card>

                <v-card v-else>
                    <v-card-text>
                        <div class="subheading">
                            <div>Loading account...</div>
                        </div>
                    </v-card-text>
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
                allowEdit: false,

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

        computed: {
            user() {
                if (this.$store.state.USER) {
                    return this.$store.state.USER;
                } else {
                    return null;
                }
            },
        },

        created() {
            auth.onAuthStateChanged( user => this.authenticated(user) );
        },
    }
</script>

<style lang='css'>

</style>
