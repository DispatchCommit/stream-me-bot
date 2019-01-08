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
                    <v-icon class="mr-2" large="large">https</v-icon> Dispatch Center
                </div>

                <v-card
                    class="mb-3"
                    light="light"
                >
                    <v-card-text>
                        <div class="subheading">
                            <template v-if="options.isLoggingIn">Log in to your portal</template>
                            <template v-else>Crate a new account</template>
                        </div>

                        <v-form>
                            <v-text-field
                                v-if="!options.isLoggingIn"
                                v-model="user.name"
                                light="light"
                                prepend-icon="person"
                                label="Name"
                            />

                            <v-text-field
                                v-model="user.email"
                                :rules="emailRules"
                                light="light"
                                prepend-icon="email"
                                label="Email"
                                type="email"
                            />

                            <v-text-field
                                v-model="user.password"
                                :rules="passwordRules"
                                light="light"
                                prepend-icon="lock"
                                label="Password"
                                type="password"
                            ></v-text-field>

                            <v-checkbox
                                v-if="options.isLoggingIn"
                                v-model="options.shouldStayLoggedIn"
                                class="mb-4"
                                light="light"
                                label="Stay logged in?"
                                hide-details="hide-details"
                            ></v-checkbox>

                            <v-btn
                                v-if="options.isLoggingIn"
                                color="primary"
                                block="block"
                                type="submit"
                                depressed
                                @click.prevent="signIn(user.email, user.password)"
                            >Sign in</v-btn>

                            <v-btn
                                v-else
                                block="block"
                                type="submit"
                                color="primary"
                                depressed
                                @click.prevent="createUser(user.email, user.password)"
                            >Sign up</v-btn>

                        </v-form>
                    </v-card-text>
                </v-card>

                <div v-if="options.isLoggingIn">
                    <span>
                        Don't have an account?
                    </span>

                    <v-btn
                        small
                        outline
                        color="primary"
                        @click="options.isLoggingIn = false"
                    >Sign up</v-btn>

                </div>

                <div v-else>
                    <span>
                        Already have an account?
                    </span>

                    <v-btn
                        small
                        outline
                        color="primary"
                        @click="options.isLoggingIn = true"
                    >Log In</v-btn>

                </div>

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

            </v-flex>



        </v-layout>



    </v-container>

</template>

<script>
    import { auth } from '~/plugins/firebase.js'

    export default {
        name: 'login',

        data() {
            return {
                user: {
                    name: '',
                    email: '',
                    password: '',
                },

                options: {
                    isLoggingIn: true,
                    shouldStayLoggedIn: true,
                    show: false,
                },

                showError: false,
                error: {
                    code: '',
                    message: '',
                },

                emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
                ],

                passwordRules: [
                    v => !!v || 'Password is required',
                    v => v.length > 6 || 'Password must be more than 6 characters'
                ],
            }
        },

        methods: {
            async createUser(email, password) {
                try {
                    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                    console.log(userCredential);
                } catch (error) {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    this.error = error;
                    this.showError = true;
                    console.error(`${errorCode}: ${errorMessage}`);
                }
            },

            async signIn(email, password) {
                try {
                    const userCredential = await auth.signInWithEmailAndPassword(email, password);
                    console.log(userCredential);
                } catch (error) {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    this.error = error;
                    this.showError = true;
                    console.error(`${errorCode}: ${errorMessage}`);
                }
            },

            async testCreate() {
                await this.createUser('admins@test.com', 'testing123');
            },

            async testSignIn() {
                await this.signIn('admins@test.com', 'testing123');
            },
        },

        computed: {

        },
    }
</script>

<style lang='css'>
    .login-form {
        max-width: 500px;
    }

</style>
