<template>
  <div>
      <v-layout
          column
          justify-center
          align-center
      >
          <v-flex>

              <v-layout
                  justify-center
                  style="background: #000;"
              >
                  <v-responsive
                      class="desktop"
                      :aspect-ratio="16/9"
                  >
                      <iframe
                          :src='embedURL'
                          frameborder="0"
                      ></iframe>
                  </v-responsive>
              </v-layout>

              <hr class="mb-2">

              <v-layout
                  row
                  wrap
              >
                  <template
                      v-for="(username, index) in users"
                  >
                      <v-flex
                          :key="username"
                      >
                          <v-btn
                              :color="username[2]"
                              @click="user = username[1]"
                          >{{ username[0] }}</v-btn>
                      </v-flex>
                      <div
                          v-if="((index+1) % 8 === 0)"
                          :key="username"
                          style="width: 100%;"></div>
                  </template>
              </v-layout>

          </v-flex>
      </v-layout>
  </div>
</template>

<script>
    export default {
        name: 'Snipe',

        data() {
            return {
                users: [
                    [ 'Kitty', 'kittystyle'    , 'error'   ],
                    [ 'Kvlski', 'kovalski'     , '#FFEB3B' ],
                    [ 'Ralph', 'theralphretort', '#4CAF50' ],
                    [ 'Andy', 'andyvio'        , '#4CAF50' ],
                    [ 'Zidan', 'zidan'         , '#009688' ],
                    [ 'Gator', 'Gator'         , '#009688' ],
                    [ 'Josh', 'KiwiFarms'      , '#8BC34A' ],
                    [ 'Jim', 'mistermetokur'   , '#2196f3' ],
                    [ 'Rand', 'randbot2020'    , 'info'    ],
                    [ 'Mobtek', 'mobtek'       , 'info'    ],
                    [ 'SPCC', 'spcc'           , 'info'    ],
                    [ 'DarkV', 'darkvulgar'    , 'info'    ],
                    [ 'COG', 'TheCognificent'  , 'info'    ],
                    [ 'Danish', 'danishpolice' , '#607D8B' ],
                    [ 'Dsptch', 'dispatch'     , '#607D8B' ],
                    [ 'NPC', 'NPCAnon88'       , '#607D8B' ],
                ],
                chat: false,
                user: 'kittystyle',
            }
        },

        computed: {
            embedURL() {
                return`https://www.stream.me/stream-embed/${ this.user }/chat-right?hideChat=${ !this.chat }&noPopoutButton=true`;
            }
        },

        methods: {

        },
    }
</script>

<style lang="css">
    /* Handled in Capture Now
    .theme--light.application {
        background: transparent;
    }*/

    /* Handled in Capture Now */
    .theme--light.application {
        background: #333 !important;
    }

    .desktop {
        display: flex;
        justify-content: center;
    }
</style>
