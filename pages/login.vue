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

                        <v-form ref="loginForm">
                            <v-text-field
                                v-if="!options.isLoggingIn"
                                v-model="user.name"
                                :disabled="loading"
                                validate-on-blur
                                light="light"
                                prepend-icon="person"
                                label="Username"
                            />

                            <v-text-field
                                v-model="user.email"
                                :rules="emailRules"
                                :disabled="loading"
                                validate-on-blur
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
                                :append-icon="options.showPassword ? 'visibility' : 'visibility_off'"
                                @click:append="options.showPassword = !options.showPassword"
                                hint="At least 6 characters"
                                counter
                                validate-on-blur
                                label="Password"
                                :type="options.showPassword ? 'text' : 'password'"
                            ></v-text-field>

                            <v-checkbox
                                v-if="options.isLoggingIn"
                                v-model="options.shouldStayLoggedIn"
                                :disabled="loading"
                                light="light"
                                label="Stay logged in"
                                hide-details="hide-details"
                            ></v-checkbox>

                            <v-btn
                                v-if="options.isLoggingIn"
                                :disabled="loading"
                                class="mt-3"
                                color="primary"
                                block="block"
                                type="submit"
                                depressed
                                @click.prevent="signIn(user.email, user.password)"
                            >Login</v-btn>

                            <v-btn
                                v-else
                                :disabled="loading"
                                class="mt-3"
                                block="block"
                                type="submit"
                                color="primary"
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

    const Cookie = process.client ? require('js-cookie') : undefined;

    export default {
        name: 'login',

        middleware: 'not-auth',

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
                    showPassword: false,
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
                if (!this.$refs.loginForm.validate()) return;

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
                } catch (error) {
                    this.showErrorToast(error.message);
                }
                this.loading = false;
            },

            async signIn(email, password) {
                if (!this.$refs.loginForm.validate()) return;

                this.loading = true;
                try {
                    await auth.setPersistence(this.options.shouldStayLoggedIn ? 'local' : 'session'); // firebase.auth.Auth.Persistence.SESSION
                    const userCredential = await auth.signInWithEmailAndPassword(email, password);

                    console.log(`%cLogin.vue:%c Signing in... %o`, 'background: #2196f3; color: #fff; border-radius: 3px; padding: .25rem;', '', userCredential.user);
                } catch (error) {
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

            async authenticated(user) {
                if (user) {
                    console.log(`%cLogin.vue:%c Logged in! %o`, 'background: #2196f3; color: #fff; border-radius: 3px; padding: .25rem;', '', user);

                    await this.$store.dispatch('login', user);

                    this.showSuccessToast(`Logged in!`);

                    this.$router.push('/profile');
                } else {
                    this.showErrorToast(`Not Logged In!`);
                    console.log(`%cLogin.vue:%c Not Logged In!`, 'background: #2196f3; color: #fff; border-radius: 3px; padding: .25rem;', '');
                }
            },
        },

        computed: {

        },

        created() {
            auth.onAuthStateChanged( async user => await this.authenticated(user) );
        },
    }
</script>

<style lang='css'>
    .login-form {
        max-width: 500px;
    }
</style>
