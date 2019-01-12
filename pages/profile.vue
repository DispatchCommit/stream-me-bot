<template>
    <v-container
        fill-height
    >
        <v-layout
            align-center
            justify-center
        >

            <v-flex
                style="max-width: 600px"
                class='login-form'
            >

                <v-card
                    class="mb-3"
                    light="light"
                >
                    <v-img src="https://images.unsplash.com/photo-1547095912-1bc0ec9c075c" :aspect-ratio="27/9">
                        <v-layout
                            fill-height
                            column
                            pa-2
                        >
                            <v-spacer/>
                            <v-flex shrink>
                                <div class="headline white--text">
                                    Account Details
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-img>

                    <v-tabs
                        v-model="currentTab"
                        color="blue-grey"
                        slider-color="amber"
                        dark
                        grow
                    >
                        <v-tab
                            ripple
                        >
                            Overlay Settings
                        </v-tab>
                        <v-tab
                            ripple
                        >
                            Account Options
                        </v-tab>
                        <v-tab
                            ripple
                        >
                            Linked Accounts
                        </v-tab>
                    </v-tabs>

                    <v-card-text
                        v-if="user"
                    >
                        <v-form v-if="currentTab === 0">
                            <v-text-field
                                v-model="user.streamme"
                                :readonly="!allowEdit"
                                light="light"
                                prepend-icon="person"
                                label="Stream.me Username"
                            />
                        </v-form>

                        <v-form v-if="currentTab === 1">
                            <v-text-field
                                v-model="user.name"
                                :readonly="!allowEdit"
                                light="light"
                                prepend-icon="person"
                                label="Display Name"
                            />
                            <v-text-field
                                v-model="user.username"
                                :readonly="!allowEdit"
                                light="light"
                                prepend-icon="person"
                                label="Username"
                            />
                            <v-text-field
                                v-model="user.email"
                                :readonly="!allowEdit"
                                light="light"
                                prepend-icon="person"
                                label="Email"
                            />
                        </v-form>

                        <div v-if="currentTab === 2">
                            <v-alert
                                :value="true"
                                type="error"
                            >
                                Not implemented currently!
                            </v-alert>
                        </div>

                        <div
                            class="text-xs-left"
                        >
                            <small>UID: {{ !!user ? user.uid : '...' }}</small>
                        </div>

                    </v-card-text>

                    <v-card-actions>
                        <v-spacer/>
                        <v-btn
                            color="primary"
                            flat
                            nuxt
                            disabled
                        >Edit</v-btn>
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
    import { auth, db } from '@/plugins/firebase.js'

    export default {
        name: 'profile',

        middleware: 'auth',

        data() {
            return {
                currentTab: 0,

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
                this.$router.push('/signout');
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
                    // this.getProfile(this.uid);
                } else {
                    this.$router.push('/login');
                }
            },
        },

        computed: {
            uid() {
                if (this.$store.state.auth) {
                    return this.$store.state.auth.uid;
                } else {
                    return null;
                }
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
            auth.onAuthStateChanged( user => this.authenticated(user) );
        },
    }
</script>
