<template>
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
        <!--<vuetify-logo/>-->
      </div>

      <v-card>
        <v-card-title class="headline">Welcome to Dispatch's Stream</v-card-title>

        <v-card-text>
          <p>This is where I plan to place a video or other capture source media.
          <br>Vueitfy is inspired by Google's material design guidelines.</p>

          <p>Thank you for watching my development process process.
          <br>I am using Vue.js & Nuxt combined with with Vuetify's material design components.</p>

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
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  components: {
    Logo,
    VuetifyLogo
  }
}
</script>
