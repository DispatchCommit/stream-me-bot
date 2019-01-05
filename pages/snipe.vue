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

                  <v-flex
                      v-for="(user) in users"
                      :key="user.username"
                      text-xs-center
                  >

                      <v-btn
                          :color=" user.live ? '#2196f3' : 'error' "
                          @click="currentUser = user.username"
                      >
                          {{ user.label }} ({{ user.viewers }})
                      </v-btn>

                  </v-flex>

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
                    {
                        label: 'Kitty',
                        username: 'kittystyle',
                        live: false,
                        viewers: 0,
                    },
                    {
                        label: 'KOVALSKI',
                        username: 'kovalski',
                        live: false,
                        viewers: 0,
                    },
                    {
                        label: 'Ralph',
                        username: 'theralphretort',
                        live: false,
                        viewers: 0,
                    },
                    {
                        label: 'Zidan',
                        username: 'zidan',
                        live: false,
                        viewers: 0,
                    },
                    {
                        label: 'Gator',
                        username: 'gator',
                        live: false,
                        viewers: 0,
                    },
                    {
                        label: 'Josh',
                        username: 'kiwifarms',
                        live: false,
                        viewers: 0,
                    },
                    {
                        label: 'Jim',
                        username: 'mistermetokur',
                        live: false,
                        viewers: 0,
                    },
                    {
                        label: 'Rand',
                        username: 'randbot2020',
                        live: false,
                        viewers: 0,
                    },
                    {
                        label: 'DarkV',
                        username: 'darkvulgar',
                        live: false,
                        viewers: 0,
                    },
                    {
                        label: 'COG',
                        username: 'TheCognificent',
                        live: false,
                        viewers: 0,
                    },
                    {
                        label: 'SPCC',
                        username: 'spcc',
                        live: false,
                        viewers: 0,
                    },
                    {
                        label: 'Alex',
                        username: 'danishpolice',
                        live: false,
                        viewers: 0,
                    },
                    {
                        label: 'DISPATCH',
                        username: 'dispatch',
                        live: false,
                        viewers: 0,
                    },
                    {
                        label: 'NPC',
                        username: 'NPCAnon88',
                        live: false,
                        viewers: 0,
                    },
                ],
                chat: false,
                currentUser: 'kittystyle',
            }
        },

        computed: {
            embedURL() {
                return`https://www.stream.me/stream-embed/${ this.currentUser }/chat-right?hideChat=${ !this.chat }&noPopoutButton=true`;
            }
        },

        methods: {
            async getUserData(username) {
                let url = `https://cors.io/?https://www.stream.me/api-user/v2/${ username }/app/web/channel`;
                try {
                    return await this.$axios.$get(url);
                } catch (e) {
                    console.error(e);
                    return null;
                }
            },

            checkIfLive(data) {
                if (data) {
                    return !!data._embedded.streams[0].active;
                } else {
                    return true;
                }
            },

            getViewers(data) {
                if (data) {
                    return data.stats.raw.viewers;
                } else {
                    return 0;
                }
            },

            async updateUsers() {
                console.log('Getting latest user data...');

                for (let i = 0, j = this.users.length; i < j; i++) {
                    const user = this.users[i];

                    this.users[i]._data = await this.getUserData(user.username);

                    this.users[i].live = this.checkIfLive(user._data);
                    this.users[i].viewers = this.getViewers(user._data);

                    console.log(`${user.username} - Live: ${ user.live }, Viewers: ${ user.viewers }`);
                }
            },
        },

        async mounted() {
            await this.updateUsers();

            const timeToRefresh = 60;
            setInterval( async () => await this.updateUsers(), timeToRefresh * 1000 );
        }

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
