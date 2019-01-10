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
                                :disabled="loading"
                                light="light"
                                prepend-icon="person"
                                label="Username"
                            />

                            <v-text-field
                                v-model="user.email"
                                :rules="emailRules"
                                :disabled="loading"
                                light="light"
                                prepend-icon="email"
                                label="Email"
                                type="email"
                            />

                            <v-text-field
                                v-model="user.password"
                                :rules="passwordRules"
                                :disabled="loading"
                                light="light"
                                prepend-icon="lock"
                                label="Password"
                                type="password"
                            ></v-text-field>

                            <v-checkbox
                                v-if="options.isLoggingIn"
                                v-model="options.shouldStayLoggedIn"
                                :disabled="loading"
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
                                :disabled="loading"
                                depressed
                                @click.prevent="signIn(user.email, user.password)"
                            >Sign in</v-btn>

                            <v-btn
                                v-else
                                block="block"
                                type="submit"
                                color="primary"
                                :disabled="loading"
                                depressed
                                @click.prevent="createUser(user.email, user.password, user.name)"
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

            </v-flex>



        </v-layout>



    </v-container>

</template>

<script>
    import { auth, db } from '@/plugins/firebase.js'

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

                loading: false,

                showError: false,
                error: {
                    code: '',
                    message: '',
                },

                showSuccess: false,
                success: {
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
            async createUser(email, password, username) {
                this.loading = true;
                try {
                    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                    console.log(userCredential);
                    const userId = userCredential.user.uid;
                    const docRef = await db.collection('users').doc(userId).set({
                        uid: userId,
                        username: username,
                        email: email,
                    });
                    console.log(docRef);
                    this.showSuccessToast(`Logged in!`);
                } catch (error) {
                    // this.error = error;
                    // this.showError = true;
                    console.error(`${error.code}: ${error.message}`);
                    this.showErrorToast(error.message);
                }
                this.loading = false;
            },

            async signIn(email, password) {
                this.loading = true;
                try {
                    const userCredential = await auth.signInWithEmailAndPassword(email, password);
                    console.log(userCredential);
                    this.showSuccessToast(`Logged in!`);
                } catch (error) {
                    // this.error = error;
                    // this.showError = true;
                    console.error(`${error.code}: ${error.message}`);
                    this.showErrorToast(error.message);
                }
                this.loading = false;
            },

            showErrorToast(message) {
                this.showError = true;
                this.error.message = message;
            },

            showSuccessToast(message) {
                this.showSuccess = true;
                this.success.message = message;
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
