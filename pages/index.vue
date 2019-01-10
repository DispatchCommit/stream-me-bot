<template>
    <v-container
        fill-height
    >
        <v-layout
            column
            justify-center
            align-center>
            <v-flex
                xs12
                sm8
                md6>
                <div class="text-xs-center mb-1">
                    <logo/>
                </div>

                <v-card>
                    <v-card-title class="headline">Welcome to Dispatch's Stream Overlay</v-card-title>

                    <v-card-text>
                        <p>An advanced streaming utility optimized for stream sniping and video viewing built with Vuetify, Nuxt, and Vue.js, running on Heroku, and backed by Firebase.
                            <br>Vueitfy is inspired by Google's material design guidelines.</p>

                        <p>Thank you for watching my development process and supporting my streams.</p>

                        <div class="text-xs-right">
                            <em><small>&mdash; Dispatch</small></em>
                        </div>
                        <hr class="my-3">
                        <a
                            href="https://vuetifyjs.com/en/components/api-explorer"
                            target="_blank">Vuetify Documentation</a>
                        <br>
                        <a
                            href="https://nuxtjs.org/"
                            target="_blank">Nuxt Documentation</a>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer/>
                        <v-btn
                            color="primary"
                            flat
                            nuxt
                            to="/inspire">Continue</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Logo from '~/components/Logo.vue'

    export default {
        components: {
            Logo,
        },
    }
</script>
